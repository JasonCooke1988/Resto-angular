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
    trigger('mouseEditTable', [
      state('move', style({
        cursor: 'move',
      })),
      state('ne-resize', style({
        cursor: 'nesw-resize',
      })),
      state('nw-resize', style({
        cursor: 'nwse-resize',
      })),
      state('se-resize', style({
        cursor: 'nwse-resize',
      })),
      state('sw-resize', style({
        cursor: 'nesw-resize',
      })),
      state('n-resize', style({
        cursor: 'ns-resize',
      })),
      state('s-resize', style({
        cursor: 'ns-resize',
      })),
      state('e-resize', style({
        cursor: 'ew-resize',
      })),
      state('w-resize', style({
        cursor: 'ew-resize',
      })),
      state('default', style({
        cursor: 'default',
      })),
    ])
  ]
})

export class CanvasComponent implements AfterViewInit, OnInit {

  context!: CanvasRenderingContext2D;
  private rect: any;
  hoverTable!: Table | undefined;
  selectedTable!: Table | undefined;
  mouse!: Mouse;

  //State used for cursor animation
  mouseEditTable!: string;

  dragging!: boolean;
  resizeTableTop!: boolean;
  resizeTableRight!: boolean;
  resizeTableBottom!: boolean;
  resizeTableLeft!: boolean;
  resizeTableTopRight!: boolean;
  resizeTableBottomRight!: boolean;
  resizeTableBottomLeft!: boolean;
  resizeTableTopLeft!: boolean;

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

    if (this.mouse.y > table.y - 10 && this.mouse.y < table.y + 10 &&
      this.mouse.x > table.x + table.width - 10 && this.mouse.x < table.x + table.width + 10) {

      this.mouseEditTable = 'ne-resize';
      this.hoverTable = table;

    } else if (this.mouse.y > table.y + table.height - 10 && this.mouse.y < table.y + table.height + 10 &&
      this.mouse.x > table.x + table.width - 10 && this.mouse.x < table.x + table.width + 10) {

      this.mouseEditTable = 'se-resize';
      this.hoverTable = table;

    } else if (this.mouse.y > table.y - 10 && this.mouse.y < table.y + 10 &&
      this.mouse.x > table.x - 10 && this.mouse.x < table.x + 10) {

      this.mouseEditTable = 'nw-resize';
      this.hoverTable = table;

    } else if (this.mouse.y > table.y + table.height - 10 && this.mouse.y < table.y + table.height + 10 &&
      this.mouse.x > table.x - 10 && this.mouse.x < table.x + 10) {

      this.mouseEditTable = 'sw-resize';
      this.hoverTable = table;

    } else if (this.mouse.y > table.y - 10 && this.mouse.y < table.y + 10 &&
      this.mouse.x > table.x && this.mouse.x < table.x + table.width) {

      this.mouseEditTable = 'n-resize';
      this.hoverTable = table;

    } else if (this.mouse.x > table.x && this.mouse.x < table.x + table.width
      && this.mouse.y > table.y + table.height - 10 && this.mouse.y < table.y + table.height + 10) {

      this.mouseEditTable = 's-resize';
      this.hoverTable = table;

    } else if (this.mouse.x > table.x + table.width - 10 && this.mouse.x < table.x + table.width + 10 &&
      this.mouse.y > table.y && this.mouse.y < table.y + table.height) {

      this.mouseEditTable = 'e-resize';
      this.hoverTable = table;

    } else if (this.mouse.x > table.x - 10 && this.mouse.x < table.x + 10
      && this.mouse.y > table.y && this.mouse.y < table.y + table.height) {

      this.mouseEditTable = 'w-resize';
      this.hoverTable = table;

    } else if ((this.mouse.x >= table.x && this.mouse.x <= table.x + table.width) &&
      (this.mouse.y >= table.y && this.mouse.y <= table.y + table.height)) {

      this.mouseEditTable = 'move';
      this.hoverTable = table;

    }
  }

  updateMousePos(e: MouseEvent) {
    this.mouse.x = e.clientX - this.rect.left;
    this.mouse.y = e.clientY - this.rect.top;

    this.mouseEditTable = 'default';

    this.tables.forEach(table => {
      this.mouseHoverDetection(table);
    })
  }

  mouseDown(e: MouseEvent) {
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();

    if (this.selectedTable != undefined) {
      this.selectedTable.selected = false;
      this.selectedTable = undefined;
    }

    //If the mouse is hovering over a table we define a selected table and allow the user to drag
    if (this.hoverTable != undefined && this.mouseEditTable === 'move') {
      this.selectedTable = this.hoverTable;
      this.selectedTable.selected = true;
      this.selectedTableEvent.emit(this.selectedTable);
      this.dragging = true;

    } else if (this.hoverTable != undefined && this.mouseEditTable === 'n-resize') {

      this.selectedTable = this.hoverTable;
      this.selectedTable.selected = true;
      this.selectedTableEvent.emit(this.selectedTable);
      this.resizeTableTop = true;

    } else if (this.hoverTable != undefined && this.mouseEditTable === 's-resize') {

      this.selectedTable = this.hoverTable;
      this.selectedTable.selected = true;
      this.selectedTableEvent.emit(this.selectedTable);
      this.resizeTableBottom = true;

    } else if (this.hoverTable != undefined && this.mouseEditTable === 'e-resize') {

      this.selectedTable = this.hoverTable;
      this.selectedTable.selected = true;
      this.selectedTableEvent.emit(this.selectedTable);
      this.resizeTableRight = true;
    } else if (this.hoverTable != undefined && this.mouseEditTable === 'w-resize') {

      this.selectedTable = this.hoverTable;
      this.selectedTable.selected = true;
      this.selectedTableEvent.emit(this.selectedTable);
      this.resizeTableLeft = true;
    } else if (this.hoverTable != undefined && this.mouseEditTable === 'ne-resize') {

      this.selectedTable = this.hoverTable;
      this.selectedTable.selected = true;
      this.selectedTableEvent.emit(this.selectedTable);
      this.resizeTableTopRight = true;
    } else if (this.hoverTable != undefined && this.mouseEditTable === 'se-resize') {

      this.selectedTable = this.hoverTable;
      this.selectedTable.selected = true;
      this.selectedTableEvent.emit(this.selectedTable);
      this.resizeTableBottomRight = true;
    } else if (this.hoverTable != undefined && this.mouseEditTable === 'sw-resize') {

      this.selectedTable = this.hoverTable;
      this.selectedTable.selected = true;
      this.selectedTableEvent.emit(this.selectedTable);
      this.resizeTableBottomLeft = true;
    } else if (this.hoverTable != undefined && this.mouseEditTable === 'nw-resize') {

      this.selectedTable = this.hoverTable;
      this.selectedTable.selected = true;
      this.selectedTableEvent.emit(this.selectedTable);
      this.resizeTableTopLeft = true;
    }
  }

  mouseUp(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    // clear action status
    this.dragging = false;
    this.resizeTableLeft = false;
    this.resizeTableRight = false;
    this.resizeTableTop = false;
    this.resizeTableBottom = false;
    this.resizeTableTopRight = false;
    this.resizeTableBottomRight = false;
    this.resizeTableBottomLeft = false;
    this.resizeTableTopLeft = false;

  }

  mouseMove(e: MouseEvent) {

    this.updateMousePos(e);
    e.preventDefault();
    e.stopPropagation();

    if (this.dragging) {

      //Compares selected table with all tables present on canvas to check overlap and out of bounds

      let cloneTable = {...this.selectedTable};
      // @ts-ignore
      cloneTable.x = this.mouse.x - this.selectedTable.width / 2;
      // @ts-ignore
      cloneTable.y = this.mouse.y - this.selectedTable.height / 2;

      this.tables.forEach(compare => {

        if (cloneTable.id != compare.id
          && !this.canvasService.detectOverlap(<Table>cloneTable, compare)
          && !this.canvasService.detectOutOfBounds(<Table>cloneTable, this.context.canvas)) {

          // @ts-ignore
          this.selectedTable.x = cloneTable.x;
          // @ts-ignore
          this.selectedTable.y = cloneTable.y;
        }
      })

    } else if (this.resizeTableTop) {

      // @ts-ignore
      let yDiff = this.selectedTable.y - this.mouse.y;

      // @ts-ignore
      this.selectedTable.y = this.mouse.y;
      // @ts-ignore
      this.selectedTable.height += yDiff;

    } else if (this.resizeTableBottom) {

      // @ts-ignore
      let yDiff = this.mouse.y - (this.selectedTable.y + this.selectedTable.height);
      // @ts-ignore
      this.selectedTable.height += yDiff;

    } else if (this.resizeTableRight) {

      // @ts-ignore
      let xDiff = this.mouse.x - (this.selectedTable.x + this.selectedTable.width);

      // @ts-ignore
      this.selectedTable.width += xDiff;
    } else if (this.resizeTableLeft) {

      // @ts-ignore
      let xDiff = this.selectedTable.x - this.mouse.x;

      // @ts-ignore
      this.selectedTable.x = this.mouse.x;

      // @ts-ignore
      this.selectedTable.width += xDiff;
    } else if (this.resizeTableTopRight) {

      // @ts-ignore
      let yDiff = this.selectedTable.y - this.mouse.y;

      // @ts-ignore
      this.selectedTable.y = this.mouse.y;
      // @ts-ignore
      this.selectedTable.height += yDiff;

      // @ts-ignore
      let xDiff = this.mouse.x - (this.selectedTable.x + this.selectedTable.width);

      // @ts-ignore
      this.selectedTable.width += xDiff;
    } else if (this.resizeTableBottomRight) {

      // @ts-ignore
      let yDiff = this.mouse.y - (this.selectedTable.y + this.selectedTable.height);

      // @ts-ignore
      this.selectedTable.height += yDiff;

      // @ts-ignore
      let xDiff = this.mouse.x - (this.selectedTable.x + this.selectedTable.width);

      // @ts-ignore
      this.selectedTable.width += xDiff;
    } else if (this.resizeTableBottomLeft) {

      // @ts-ignore
      let yDiff = this.mouse.y - (this.selectedTable.y + this.selectedTable.height);

      // @ts-ignore
      this.selectedTable.height += yDiff;

      // @ts-ignore
      let xDiff = this.selectedTable.x - this.mouse.x;

      // @ts-ignore
      this.selectedTable.x = this.mouse.x;

      // @ts-ignore
      this.selectedTable.width += xDiff;
    } else if (this.resizeTableTopLeft) {

      // @ts-ignore
      let yDiff = this.selectedTable.y - this.mouse.y;

      // @ts-ignore
      this.selectedTable.y = this.mouse.y;
      // @ts-ignore
      this.selectedTable.height += yDiff;

      // @ts-ignore
      let xDiff = this.selectedTable.x - this.mouse.x;

      // @ts-ignore
      this.selectedTable.x = this.mouse.x;

      // @ts-ignore
      this.selectedTable.width += xDiff;
    }

  }


  tick() {
    requestAnimationFrame(() => this.tick());

    const ctx = this.context;
    ctx.clearRect(-1, -1, this.rect.width + 1, this.rect.height + 1);

    // draw tables
    this.tables.forEach(table => {
      this.tableService.drawTable(ctx, table);
    })
  }
}
