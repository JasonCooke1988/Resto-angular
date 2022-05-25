import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Table} from "../../core/models/table.model";
import {Mouse} from "../../core/models/mouse.model";
import {TablesService} from "../../core/services/tables.service";
import {CanvasService} from "../../core/services/canvas.service";
import {state, style, trigger} from "@angular/animations";

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styles: ['canvas {border: 1px solid black;}'],
  animations: [
    trigger('moveTableToggle', [
      state('moving', style({
        cursor: 'move'
      })),
      state('movingOff', style({
        cursor: 'default'
      }))
    ])
  ]
})
export class CanvasComponent implements AfterViewInit, OnInit {

  context!: CanvasRenderingContext2D;
  dragok!: Boolean;
  resizeTable!: boolean;
  moveTable!: boolean;
  mouse!: Mouse;
  private rect: any;

  @Output() selectedTableEvent = new EventEmitter<Table>()
  @ViewChild('canvas') canvas!: ElementRef;
  @Input() tables!: Table[];

  constructor(private tableService: TablesService,
              private canvasService: CanvasService) {
  }

  ngOnInit(): void {
    this.mouse = {
      x: 0,
      y: 0,
    }
  }

  ngAfterViewInit() {

    let canvasWrap = document.getElementById('canvas-wrap');
    // @ts-ignore
    let canvasWrapWidth = canvasWrap.clientWidth;
    // @ts-ignore
    let canvasWrapHeight = canvasWrap.clientHeight;

    // @ts-ignore
    this.context = document.querySelector('canvas').getContext('2d');
    this.context.canvas.width = canvasWrapWidth;
    this.context.canvas.height = canvasWrapHeight;
    this.context.translate(canvasWrapWidth / canvasWrapWidth, canvasWrapHeight / canvasWrapHeight);
    this.rect = this.context.canvas.getBoundingClientRect();

    this.tick();
  }

  mouseHoverDetection(table: Table) {
    if((this.mouse.x >= table.x && this.mouse.x <= table.x + table.width) &&
      (this.mouse.y >= table.y && this.mouse.y <= table.y + table.height)) {
      this.moveTable = true;
    }
  }

  mouseHitDetection(table: Table) {
    if ((this.mouse.x >= table.x && this.mouse.x <= table.x + table.width) &&
      (this.mouse.y >= table.y && this.mouse.y <= table.y + table.height)) {

      this.dragok = true;
      table.isDragging = true;
      table.selected = true;
      this.selectedTableEvent.emit(table);
      return true
    }
    table.isDragging = false;
    table.selected = false;
    return false;
  }

  updateMousePos(e: MouseEvent) {
    this.mouse.x = e.clientX - this.rect.left;
    this.mouse.y = e.clientY - this.rect.top;
    this.moveTable = false;

    this.tables.forEach(table => {
      this.mouseHoverDetection(table);
    })
  }

  mouseDown(e: MouseEvent) {
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();

    // get the current mouse position
    // this.updateMousePos(e);

    this.dragok = false;

    // test each rect to see if mouse is inside
    this.tables.map(element => {
      this.mouseHitDetection(element);
    });
  }

  mouseUp(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    // clear all the dragging flags
    this.dragok = false;
    this.tables.map(table => table.isDragging = false);
  }

  // handle mouse moves
  mouseMove(e: MouseEvent) {
    // if we're dragging anything...

    this.updateMousePos(e);

    if (this.dragok) {
      // tell the browser we're handling this mouse event
      e.preventDefault();
      e.stopPropagation();

      // get the current mouse position
      this.updateMousePos(e);

      this.tables.map(table => {
        if (table.isDragging) {
          this.tables.forEach(compare => {

            let cloneTable = {...table};

            cloneTable.x = this.mouse.x - table.width / 2;
            cloneTable.y = this.mouse.y - table.height / 2;

            if (cloneTable.id != compare.id && !this.canvasService.detectOverlap(cloneTable, compare) && !this.canvasService.detectOutOfBounds(cloneTable, this.context.canvas)) {
              table.x = cloneTable.x;
              table.y = cloneTable.y;
            }
          })
        }
      })
    } else if (this.resizeTable) {

    }


  }


  tick() {
    requestAnimationFrame(() => this.tick());

    const ctx = this.context;
    ctx.clearRect(-1, -1, this.rect.width + 1, this.rect.height + 1);

    // draw tables
    this.tables.map(table => {
      this.tableService.drawTable(ctx, table);
    })
  }
}
