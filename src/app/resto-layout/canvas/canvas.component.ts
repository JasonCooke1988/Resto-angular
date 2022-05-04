import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Table} from "../../core/models/table.model";
import {Mouse} from "../../core/models/mouse.model";
import {TablesService} from "../../core/services/tables.service";

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styles: ['canvas {border: 1px solid black;}']
})
export class CanvasComponent implements AfterViewInit, OnInit {

  context!: CanvasRenderingContext2D;
  dragok!: Boolean;
  mouse!: Mouse;
  private rect: any;
  @ViewChild('canvas') canvas!: ElementRef;
  @Input() tables!: Table[];

  constructor(private tableService: TablesService) {
  }

  ngOnInit(): void {
    this.mouse = {
      x: 0,
      y: 0,
    }
  }

  ngAfterViewInit() {
    const canvas = this.canvas.nativeElement;
    this.context = canvas.getContext('2d');
    this.rect = canvas.getBoundingClientRect();

    this.tick();
  }

  mouseHitDetection(table: Table) {
    if ((this.mouse.x >= table.x && this.mouse.x <= table.x + table.width) &&
      (this.mouse.y >= table.y && this.mouse.y <= table.y + table.height)) {

      this.dragok = true;
      table.isDragging = true;
      table.selected = true;
      return true
    }
    table.isDragging = false;
    table.selected = false;
    return false;
  }

  updateMousePos(e: MouseEvent) {
    this.mouse.x = e.clientX - this.rect.left;
    this.mouse.y = e.clientY - this.rect.top;
  }

  mouseDown(e: MouseEvent) {
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();

    // get the current mouse position
    this.updateMousePos(e);

    // test each rect to see if mouse is inside
    this.dragok = false;

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
    if (this.dragok) {
      // tell the browser we're handling this mouse event
      e.preventDefault();
      e.stopPropagation();

      // get the current mouse position
      this.updateMousePos(e);

      this.tables.map(table => {
        if (table.isDragging) {
          table.x = this.mouse.x - table.width / 2;
          table.y = this.mouse.y - table.height / 2;
        }
      })
    }
  }


  tick() {
    requestAnimationFrame(() => this.tick());

    const ctx = this.context;
    ctx.clearRect(0, 0, 850, 500);

    // draw tables
    this.tables.map(table => {
      this.tableService.drawTable(ctx, table);
    })
  }
}
