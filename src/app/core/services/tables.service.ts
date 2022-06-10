import {Injectable} from "@angular/core";
import {Table} from "../models/table.model";
import { Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TablesService {

  tables: Table[] = [
    {
      id: 400,
      width: 50,
      height: 50,
      x: 100,
      y: 100,
      tableNumber: 1,
      seats: 2,
      selected: false,
      hovering: false
    },
    {
      id: 2,
      width: 100,
      height: 50,
      x: 200,
      y: 200,
      tableNumber: 2,
      seats: 5,
      selected: false,
      hovering: false
    }
  ]

  selectedTable!: Table | null;

  constructor() {
  }

  // createDb() {
  //   const TABLES = [
  //     {
  //       id: 1,
  //       width: 50,
  //       height: 50,
  //       x: 100,
  //       y: 100,
  //       tableNumber: 1,
  //       seats: 2,
  //       selected: false
  //     },
  //     {
  //       id: 2,
  //       width: 100,
  //       height: 50,
  //       x: 200,
  //       y: 200,
  //       tableNumber: 2,
  //       seats: 5,
  //       selected: false
  //     }
  //   ];
  //   return {TABLES};
  // }

  getTables(): Observable<Table[]> {
    return of(this.tables);
  }

  // addTable(): Observable<Table[]> {
  //
    // const table: Table = {
    //   id: this.tables[this.tables.length - 1].id + 1,
    //   width: 50,
    //   height: 50,
    //   x: 0,
    //   y: 0,
    //   tableNumber: 0,
    //   seats: 0,
    //   selected: true
    // }
    //
    // this.tables.push(table);
  //
  //   return this.getTables();
  // }

  // updateTables(tables: Table[]): Observable<Table[]> {
  //   this.tables = tables;
  //   return this.getTables();
  // }

  detectOverlap(table: Table) {

    let count = 0;
    let length = 0;

    length = this.tables.length;
    this.tables.forEach(compare => {
      if (table.id != compare.id) {
        if ((!(table.x < compare.x + compare.width &&
          table.x + table.width > compare.x &&
          table.y < compare.y + compare.height &&
          table.height + table.y > compare.y) && table.height >= 50 && table.width >= 50)) {
          count++;
        }
      } else {
        count++;
      }
    })

    return count != length;
  }

  drawTables(ctx: CanvasRenderingContext2D) {

    this.tables.forEach(table => {
      ctx.beginPath()
      ctx.shadowColor = 'black';
      ctx.shadowBlur = 3.5;
      ctx.fillStyle = "rgba(75,57,44,0.70)";
      ctx.fillRect(
        table.x,
        table.y,
        table.width,
        table.height
      );

      ctx.font = "15px roboto";
      ctx.fillStyle = 'black';
      let text = table.tableNumber.toString();
      let textMeasure = ctx.measureText(text);
      ctx.fillText(text, table.x + (table.width / 2) - (textMeasure.width / 2), table.y + (table.height / 2) + 3.5)

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
    });
  }
}
