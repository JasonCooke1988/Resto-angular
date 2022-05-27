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

  context!: CanvasRenderingContext2D | null;
  private rect: any;
  hoverTable!: Table | undefined;
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
  @Output() clearNewTable = new EventEmitter<Table>()
  @Output() clearSelectedTable = new EventEmitter<Table>()
  @ViewChild('canvas') canvas!: ElementRef;
  @Input() tables!: Table[];
  @Input() newTable!: Table | undefined;
  @Input() selectedTable!: Table | undefined;

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
    let canvasWrapWidth = canvasWrap!.clientWidth;
    let canvasWrapHeight = canvasWrap!.clientHeight;

    this.context = document.querySelector('canvas')!.getContext('2d');
    this.context!.canvas.width = canvasWrapWidth;
    this.context!.canvas.height = canvasWrapHeight;
    this.context!.translate(canvasWrapWidth / canvasWrapWidth, canvasWrapHeight / canvasWrapHeight);
    this.rect = this.context!.canvas.getBoundingClientRect();

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
    this.hoverTable = undefined;

    this.tables.forEach(table => {
      this.mouseHoverDetection(table);
    })
  }

  mouseDown(e: MouseEvent) {
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();

    if (this.newTable != undefined) {

      this.newTable.x = this.mouse.x - this.newTable.width / 2;
      this.newTable.y = this.mouse.y - this.newTable.height / 2;

      if (!this.canvasService.detectOverlap(this.newTable)){
        this.tables.push(this.newTable);

        this.clearNewTable.emit();
      }
    } else {

      if (this.selectedTable != undefined) {
        this.clearSelectedTable.emit();
      }

      if (this.hoverTable != undefined) {

        this.selectedTable = this.hoverTable;
        this.selectedTable.selected = true;
        this.selectedTableEvent.emit(this.selectedTable);

        if (this.mouseEditTable === 'move') {
          this.dragging = true;
        } else if (this.mouseEditTable === 'n-resize') {
          this.resizeTableTop = true;
        } else if (this.mouseEditTable === 's-resize') {
          this.resizeTableBottom = true;
        } else if (this.mouseEditTable === 'e-resize') {
          this.resizeTableRight = true;
        } else if (this.mouseEditTable === 'w-resize') {
          this.resizeTableLeft = true;
        } else if (this.mouseEditTable === 'ne-resize') {
          this.resizeTableTopRight = true;
        } else if (this.mouseEditTable === 'se-resize') {
          this.resizeTableBottomRight = true;
        } else if (this.mouseEditTable === 'sw-resize') {
          this.resizeTableBottomLeft = true;
        } else if (this.mouseEditTable === 'nw-resize') {
          this.resizeTableTopLeft = true;
        }
      }

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

    if (this.selectedTable != undefined) {

      let cloneTable = {...this.selectedTable};

      if (this.dragging) {

        cloneTable.x = this.mouse.x - this.selectedTable.width / 2;
        cloneTable.y = this.mouse.y - this.selectedTable.height / 2;

        //Check out-of-bounds
        //Compares selected table with all tables present on canvas to check overlap

        if (!this.canvasService.detectOutOfBounds(<Table>cloneTable, this.context!.canvas) &&
          !this.canvasService.detectOverlap(<Table>cloneTable)) {

          this.selectedTable!.x = cloneTable.x;
          this.selectedTable!.y = cloneTable.y;
        }

      } else if (this.resizeTableTop) {

        let yDiff = cloneTable.y - this.mouse.y;
        cloneTable.y = this.mouse.y;
        cloneTable.height += yDiff;

        if (!this.canvasService.detectOverlap(<Table>cloneTable)) {
          this.selectedTable.y = cloneTable.y;
          this.selectedTable.height = cloneTable.height;
        }

      } else if (this.resizeTableBottom) {

        let yDiff = this.mouse.y - (this.selectedTable.y + this.selectedTable.height);
        cloneTable.height += yDiff;

        if (!this.canvasService.detectOverlap(<Table>cloneTable)) {
          this.selectedTable.height = cloneTable.height;
        }

      } else if (this.resizeTableRight) {

        let xDiff = this.mouse.x - (this.selectedTable.x + this.selectedTable.width);
        cloneTable.width += xDiff;

        if (!this.canvasService.detectOverlap(<Table>cloneTable)) {
          this.selectedTable.width = cloneTable.width;
        }

      } else if (this.resizeTableLeft) {

        let xDiff = this.selectedTable.x - this.mouse.x;
        cloneTable.x = this.mouse.x;
        cloneTable.width += xDiff;

        if (!this.canvasService.detectOverlap(<Table>cloneTable)) {
          this.selectedTable.width = cloneTable.width;
          this.selectedTable.x = cloneTable.x;
        }

      } else if (this.resizeTableTopRight) {

        let yDiff = this.selectedTable.y - this.mouse.y;
        cloneTable.y = this.mouse.y;
        cloneTable.height += yDiff;
        let xDiff = this.mouse.x - (this.selectedTable.x + this.selectedTable.width);
        cloneTable.width += xDiff;

        if (!this.canvasService.detectOverlap(<Table>cloneTable)) {
          this.selectedTable.y = cloneTable.y;
          this.selectedTable.height = cloneTable.height;
          this.selectedTable.width = cloneTable.width;
        }

      } else if (this.resizeTableBottomRight) {

        let yDiff = this.mouse.y - (this.selectedTable.y + this.selectedTable.height);
        cloneTable.height += yDiff;
        let xDiff = this.mouse.x - (this.selectedTable.x + this.selectedTable.width);
        cloneTable.width += xDiff;

        if (!this.canvasService.detectOverlap(<Table>cloneTable)) {
          this.selectedTable.height = cloneTable.height;
          this.selectedTable.width = cloneTable.width;
        }

      } else if (this.resizeTableBottomLeft) {

        let yDiff = this.mouse.y - (this.selectedTable.y + this.selectedTable.height);
        cloneTable.height += yDiff;
        let xDiff = this.selectedTable.x - this.mouse.x;
        cloneTable.x = this.mouse.x;
        cloneTable.width += xDiff;

        if (!this.canvasService.detectOverlap(<Table>cloneTable)) {
          this.selectedTable.height = cloneTable.height;
          this.selectedTable.x = cloneTable.x;
          this.selectedTable.width = cloneTable.width;
        }

      } else if (this.resizeTableTopLeft) {

        let yDiff = this.selectedTable.y - this.mouse.y;
        cloneTable.y = this.mouse.y;
        cloneTable.height += yDiff;
        let xDiff = this.selectedTable.x - this.mouse.x;
        cloneTable.x = this.mouse.x;
        cloneTable.width += xDiff;

        if (!this.canvasService.detectOverlap(<Table>cloneTable)) {
          this.selectedTable.y = cloneTable.y;
          this.selectedTable.height = cloneTable.height;
          this.selectedTable.x = cloneTable.x;
          this.selectedTable.width = cloneTable.width;
        }

      }

    }
  }


  tick() {
    requestAnimationFrame(() => this.tick());

    const ctx = this.context;
    ctx!.clearRect(-1, -1, this.rect.width + 1, this.rect.height + 1);

    // draw tables
    this.tables.forEach(table => {
      this.tableService.drawTable(ctx!, table);
    })
  }
}
