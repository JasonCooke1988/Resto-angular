import {Component, NgModule, OnInit} from '@angular/core';
import {Table} from "../core/models/table.model";
import {mouseState, slideInAnimation} from "../animation";
import {
  expand,
  filter,
  map,
  Observable,
  of,
  tap,
  withLatestFrom,
  fromEvent, switchMap, takeUntil, take, Subject, takeWhile,
} from "rxjs";
import {IFrameData} from "./canvas/frame.interface";
import {Mouse} from "../core/models/mouse.model";
import {CanvasService} from "../core/services/canvas.service";
import {LayoutState} from "../core/models/layoutState.model";

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
  layoutState$!: Observable<LayoutState>;
  private canvas!: HTMLElement;


  mouse$!: Observable<Mouse>;
  mouseState: String = 'default';
  private mouseDown$!: Observable<Event>;
  private mouseMove$!: Observable<Event>;

  constructor(private canvasService: CanvasService) {

    this.mouse$ = of({x: 0, y: 0, state: 'default'})
    this.mouse$.subscribe(mouse => mouse)

  }

  ngOnInit(): void {

    this.canvasService.init();

    this.tables$ = this.canvasService.tables$;

    //Set up layout config
    this.layoutState$ = this.canvasService.layoutState$;
    this.canvas = document.getElementById('canvas')!;

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
        // map(([deltaTime, layoutState, tables]) => this.update(layoutState)),
        tap(([deltaTime, layoutState, tables]) => this.canvasService.updateLayout(layoutState)),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(([deltaTime, layoutState, tables]) => {
        this.render(layoutState, tables);
      });

    //Mouse interactions observables
    this.mouseDown$ = fromEvent(this.canvas, 'mousedown');
    this.mouseMove$ = fromEvent(this.canvas, 'mousemove');
    const mouseUp$ = fromEvent(this.canvas, 'mouseup');

    const dragStart$ = this.mouseDown$;
    const dragMove$ = dragStart$.pipe(
      switchMap(start =>
        this.mouseMove$.pipe(
          withLatestFrom(this.layoutState$, this.mouse$, this.tables$),
          tap(([event, layoutState, mouse, tables]) => {
            layoutState.isDragging = true;
          }),
          takeUntil(mouseUp$),
          takeUntil(this.ngUnsubscribe)
        )
      )
    );

    dragMove$.subscribe(
      ([event, layoutState, mouse, tables]) => {
        this.canvasService.editTablePlaceSize(event, tables, layoutState, mouse)
      }
    );

    //Update mouse position
    this.mouseMove$.pipe(
      withLatestFrom(this.layoutState$, this.mouse$, this.tables$),
      tap(([evt, layoutState, mouse, tables]) => this.canvasService.updateMousePos({
        evt,
        tables,
        layoutState,
        mouse
      })),
      takeUntil(this.ngUnsubscribe)
    ).subscribe(
      ([evt, layoutState, mouse]) => {
        this.mouseState = mouse.state;
      }
    )

    this.mouseDown$.pipe(
      withLatestFrom(this.tables$, this.layoutState$),
      takeUntil(this.ngUnsubscribe)
    ).subscribe(
      ([mouse, tables, layoutState]) => {
        if (!layoutState.placingNewTable) {

          let isSelected = false;

          tables = tables.map(table => {
              table.selected = table.hovering;

              if (table.selected) {
                isSelected = true;
                this.selectedTable$ = of(table);
                console.log(table)
              }
              return table;
            }
          )

          if (!isSelected) {
            this.selectedTable$ = null
          }

          this.canvasService.saveTablesLocally(tables);

        }
      }
    )

    mouseUp$.pipe(
      withLatestFrom(this.layoutState$),
      takeUntil(this.ngUnsubscribe)
    ).subscribe(([event, layoutState]) => {
      layoutState.isDragging = false
    })

    //Refresh canvas size upon re entry into page
    setTimeout(() => {
      this.canvasService.refresh();
    }, 100)
    setTimeout(() => {
      this.canvasService.refresh();
    }, 300)
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
  render(state: any, tables: Table[]) {
    // Clear the canvas
    state['ctx'].clearRect(0, 0, state['layout'].clientWidth, state['layout'].clientHeight);

    // Render all of our objects (simple rectangles for simplicity)
    this.canvasService.drawTables(state['ctx'], state['layout'], tables);
  };

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
    }).pipe(
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

    this.selectedTable$ = null;

    this.canvasService.clearSelected()

    this.alert = "Cliquez sur un emplacement libre pour placer la nouvelle table.";

    this.canvasService.togglePlacingNewTable();

    const addTableStart$ = this.mouseDown$;
    addTableStart$.pipe(
      withLatestFrom(this.tables$, this.layoutState$, this.mouse$),
      take(1),
      takeWhile(([event, tables, layoutState, mouse]) => layoutState.placingNewTable),
      takeUntil(this.ngUnsubscribe),
      tap(([event, tables, layoutState, mouse]) => {

          let cloneTable = this.canvasService.tablesCalcRealSizeAndPlace(newTable, layoutState['layout']);

          if (!this.canvasService.detectOverlap(cloneTable, tables)) {

            this.selectedTable$ = of(newTable);
            cloneTable = this.canvasService.placeNewTable(event, tables, layoutState, mouse, newTable)
            this.canvasService.addTableRemote(cloneTable)
            this.alert = "";
            this.canvasService.togglePlacingNewTable();

          } else {

            this.alert = "Veuillez choisir un emplacement libre.";

          }

        }
      )
    ).subscribe();

  }

  deleteTable(selectedTable: Table) {

    this.canvasService.deleteTable(selectedTable).subscribe(
      () => this.canvasService.toggleIsSaved()
    );
    this.selectedTable$ = null;
  }

  saveLayout() {
    this.canvasService.saveLayout().pipe().subscribe(
      (e) => {
        this.canvasService.toggleIsSaved();
      }
    );
  }

  modifyTable() {
    if (this.canvasService.isSaved() === 'saved') {
      this.canvasService.toggleIsSaved();
    }
  }
}
