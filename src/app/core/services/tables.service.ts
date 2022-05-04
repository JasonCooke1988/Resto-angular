import {Injectable} from "@angular/core";
import {Table} from "../models/table.model";

@Injectable({
  providedIn: 'root'
})
export class TablesService {
  tables: Table[] = [
    {
      width: 50,
      height: 50,
      x: 100,
      y: 100,
      isDragging: false,
      selected: false
    },
    {
      width: 100,
      height: 50,
      x: 200,
      y: 200,
      isDragging: false,
      selected: false
    }
  ]

  getAllTables() {
    return this.tables;
  }

  drawTable(ctx: CanvasRenderingContext2D, table: Table) {
    ctx.beginPath()
    ctx.fillRect(
      table.x,
      table.y,
      table.width,
      table.height
    );
    ctx.fillStyle = "#000000";
    ctx.fill()
    ctx.closePath()

    if (table.selected) {
      ctx.strokeStyle = '#0677D7';
      ctx.lineWidth = 2.5;
      ctx.rect(
        table.x,
        table.y,
        table.width,
        table.height
      );
      ctx.stroke();
      ctx.closePath();
    }
  }
}
