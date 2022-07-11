export class LayoutState {
  layout: HTMLElement;
  ctx: CanvasRenderingContext2D;
  isDragging: boolean;
  placingNewTable: boolean;
  saveState: string;

  constructor(layout: HTMLElement, ctx: CanvasRenderingContext2D) {
    this.layout = layout;
    this.ctx = ctx;
    this.isDragging = false;
    this.placingNewTable = false;
    this.saveState = 'saved';
  }
}
