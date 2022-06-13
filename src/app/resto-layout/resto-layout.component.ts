import {Component, OnInit} from '@angular/core';
import {Table} from "../core/models/table.model";
import {TablesService} from "../core/services/tables.service";
import {mouseState, slideInAnimation} from "../animation";
import {
  BehaviorSubject,
  expand,
  filter,
  map,
  Observable,
  of,
  share,
  tap,
  withLatestFrom,
  fromEvent, switchMap, takeUntil, take, Subject,
} from "rxjs";
import {IFrameData} from "./canvas/frame.interface";
import {Mouse} from "../core/models/mouse.model";
import {CanvasService} from "../core/services/canvas.service";

@Component({
  selector: 'app-resto-layout',
  templateUrl: './resto-layout.component.html',
  styleUrls: ['./resto-layout.component.scss'],
  animations: [slideInAnimation, mouseState]
})
export class RestoLayoutComponent implements OnInit {
  tables$!: Observable<Table[]>;
  selectedTable$: Observable<Table> | null = null;
  alert: String = '';

  private ngUnsubscribe = new Subject<void>();
  private frames$!: Observable<number>;
  private layoutState$!: BehaviorSubject<any>;
  private layout!: HTMLElement;
  private ctx!: CanvasRenderingContext2D;

  mouse$!: Observable<Mouse>;
  mouseState: String = 'default';
  private mouseDown$!: Observable<Event>;
  private mouseMove$!: Observable<Event>;

  constructor(private tableService: TablesService,
              private canvasService: CanvasService) {

    this.mouse$ = of({x: 0, y: 0, state: 'default'})
    this.mouse$.subscribe(mouse => mouse)

  }

  ngOnInit(): void {

    //Set up layout config
    this.layout = document.getElementById('canvas')!;
    this.ctx = (<HTMLCanvasElement>document.getElementById('canvas')).getContext('2d')!;
    this.layoutState$ = new BehaviorSubject({
      layout: this.layout,
      ctx: this.ctx
    });

    //Set up tables observable
    this.tables$ = this.tableService.getTables().pipe(
      share()
    );
    this.tables$.subscribe(tables => tables)

    // This is our core stream of frames. We use expand to recursively call the
    //  `calculateStep` function above that will give us each new Frame based on the
    //  window.requestAnimationFrame calls.
    this.frames$ = of({deltaTime: 0, frameStartTime: 0})
      .pipe(
        expand((val) => this.calculateStep(val)),
        filter(frame => frame !== {deltaTime: 0, frameStartTime: 0}),
        map((frame: IFrameData) => frame.deltaTime),
      )


    // This is where we run our layout and perform our layoutState updates.
    this.frames$
      .pipe(
        withLatestFrom(this.layoutState$, this.tables$),
        map(([deltaTime, layoutState, tables]) => this.update(layoutState)),
        tap((layoutState) => this.layoutState$.next(layoutState)),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe((layoutState) => {
        this.render(layoutState);
      });

    //Mouse interactions observables
    this.mouseDown$ = fromEvent(this.layout, 'mousedown');
    this.mouseMove$ = fromEvent(this.layout, 'mousemove');
    const mouseUp$ = fromEvent(this.layout, 'mouseup');

    const dragStart$ = this.mouseDown$;
    const dragMove$ = dragStart$.pipe(
      switchMap(start =>
        this.mouseMove$.pipe(
          withLatestFrom(this.tables$, this.layoutState$, this.mouse$),
          tap(([event, tables, layoutState]) => {
            layoutState.dragging = true;
          }),
          takeUntil(mouseUp$),
        )
      )
    );

    dragMove$.subscribe(
      ([event, tables, layoutState, mouse]) => {
        this.canvasService.editTablePlaceSize(event, tables, layoutState, mouse)
      }
    );

    //Update mouse position
    this.mouseMove$.pipe(
      withLatestFrom(this.tables$, this.layoutState$, this.mouse$),
      tap(([evt, tables, layoutState, mouse]) => this.canvasService.updateMousePos({
        evt,
        tables,
        layoutState,
        mouse
      })),
    ).subscribe(([evt, tables, layoutState, mouse]) => {
        this.mouseState = mouse.state;
      }
    )

    this.mouseDown$.pipe(
      withLatestFrom(this.tables$, this.layoutState$),
      takeUntil(this.layoutState$.pipe(filter(val => val.placingNewTable)))
    ).subscribe(
      ([mouse, tables, layoutState]) => {

        this.selectedTable$ = null;

        tables.forEach(table => {
          table.selected = table.hovering;

          if(table.selected) {
            this.selectedTable$ = of(table);

            console.log(this.selectedTable$)
          }
        })
      }
    )

    mouseUp$.pipe(
      withLatestFrom(this.layoutState$)
    ).subscribe(([event, layoutState]) => {
      layoutState.dragging = false
    })

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  update(state: any) {
    //TODO: Do some updates
    return state;
  }

  /**
   * This is our rendering function. We take the given game state and render the items
   * based on their latest properties.
   */
  render(state: any) {
    //TODO : Put refresh somewhere where it isnt used on every render call (animation callback ?)
    this.refresh(state);
    // Clear the canvas
    state['ctx'].clearRect(0, 0, state['layout'].clientWidth, state['layout'].clientHeight);

    // Render all of our objects (simple rectangles for simplicity)
    this.tableService.drawTables(state['ctx']);
  };

  refresh(state: any) {
    let canvasWrap = document.getElementById('canvas-wrap');
    let canvasWrapWidth = canvasWrap!.clientWidth;
    let canvasWrapHeight = canvasWrap!.clientHeight;

    state['ctx'].canvas.width = canvasWrapWidth;
    state['ctx'].canvas.height = canvasWrapHeight;
    state['ctx'].translate(canvasWrapWidth / canvasWrapWidth, canvasWrapHeight / canvasWrapHeight);
  }

  /**
   * This function returns an observable that will emit the next frame once the
   * browser has returned an animation frame step. Given the previous frame it calculates
   * the delta time, and we also clamp it to 30FPS in case we get long frames.
   */
  calculateStep: (prevFrame: IFrameData) => Observable<IFrameData> = (prevFrame: IFrameData) => {
    return new Observable((observer) => {

      requestAnimationFrame((frameStartTime) => {
        // Millis to seconds
        const deltaTime = prevFrame ? (frameStartTime - prevFrame.frameStartTime) / 1000 : 0;
        observer.next({
          frameStartTime,
          deltaTime
        });
      })
    })
      .pipe(
        // @ts-ignore
        map(this.clampTo30FPS)
      )
  };

  /**
   * clampTo30FPS(frame)
   *
   * @param frame - {IFrameData} the frame data to check if we need to clamp to max of
   *  30fps time.
   *
   * If we get sporadic LONG frames (browser was navigated away or some other reason the frame takes a while) we want
   * to throttle that so we don't JUMP ahead in any deltaTime calculations too far.
   */
  clampTo30FPS(frame: IFrameData) {

    if (frame.deltaTime > (1 / 30)) {
      frame.deltaTime = 1 / 30;
    }
    return frame;
  }

  addTable(newTable: Table) {

    this.alert = "Cliquez sur un emplacement libre pour placer la nouvelle table.";

    const addTableStart$ = this.mouseDown$;
    const addTable$ = addTableStart$.pipe(
      withLatestFrom(this.tables$, this.layoutState$, this.mouse$),
      take(1),
      tap(([event, tables, layoutState, mouse]) => {
          this.canvasService.placeNewTable(event, tables, layoutState, mouse, newTable)
          this.alert = "";
        }
      )
    ).subscribe();

  }

}
