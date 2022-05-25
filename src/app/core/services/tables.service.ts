import {Injectable} from "@angular/core";
import {Table} from "../models/table.model";
import {FormGroup} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class TablesService {

  tables: Table[] = [
    {
      id: 1,
      width: 50,
      height: 50,
      x: 100,
      y: 100,
      tableNumber: 1,
      seats: 2,
      isDragging: false,
      selected: false
    },
    {
      id: 2,
      width: 100,
      height: 50,
      x: 200,
      y: 200,
      tableNumber: 2,
      seats: 5,
      isDragging: false,
      selected: false
    }
  ]

  getAllTables() {
    return this.tables;
  }

  getTable(table: Table) {
    return this.tables.find(elt => elt.id === table.id);
  }

  drawTable(ctx: CanvasRenderingContext2D, table: Table) {
    ctx.beginPath()
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 5;
    ctx.fillStyle = "rgba(75,57,44,0.70)";
    ctx.fillRect(
      table.x,
      table.y,
      table.width,
      table.height
    );

    ctx.font = "15px roboto";
    ctx.fillStyle = 'black';
    let text = ctx.measureText(table.tableNumber.toString());

    ctx.fillText(table.tableNumber.toString(), table.x + (table.width / 2) - (text.width / 2), table.y + (table.height / 2) + 3.5)

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

  updateTable(table: Table, value: FormData) {

    table = {
      ...table,
      ...value
    }
  }

  calcRight(table: Table) {
    return table.x + table.width;
  }

  calcBottom(table: Table) {
    return table.y + table.height;
  }
}
