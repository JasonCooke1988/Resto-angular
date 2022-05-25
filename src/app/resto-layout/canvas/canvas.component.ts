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
    trigger('mouseMoveTableToggle', [
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
  hoverTable!: Table | undefined;
  selectedTable!: Table | undefined;
  mouse!: Mouse;

  mouseResizeTable!: boolean;
  mouseMoveTable!: boolean;
  dragging!: boolean;
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
      this.mouseMoveTable = true;
      this.hoverTable = table;
    }
  }

  updateMousePos(e: MouseEvent) {
    this.mouse.x = e.clientX - this.rect.left;
    this.mouse.y = e.clientY - this.rect.top;

    this.hoverTable = undefined;
    this.mouseMoveTable = false;

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
    if (this.hoverTable != undefined) {
      this.selectedTable = this.hoverTable;
      this.selectedTable.selected = true;
      this.selectedTableEvent.emit(this.selectedTable);
      this.dragging = true;
    }

  }

  mouseUp(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    // clear action status
    this.dragging = false;

  }

  mouseMove(e: MouseEvent) {

    this.updateMousePos(e);
    e.preventDefault();
    e.stopPropagation();

    if (this.dragging) {

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
    } else if (this.mouseResizeTable) {

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
