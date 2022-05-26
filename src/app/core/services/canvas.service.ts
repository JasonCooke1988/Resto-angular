import {ElementRef, Injectable} from '@angular/core';
import {TablesService} from "./tables.service";
import {Table} from "../models/table.model";
import {CanvasComponent} from "../../resto-layout/canvas/canvas.component";

@Injectable({
  providedIn: 'root'
})
export class CanvasService {

  constructor(private tableService: TablesService) {
  }

  detectOverlap(table: Table) {

    let tables = this.tableService.getAllTables();

    let count = 0;

    tables.forEach( compare => {
      if (table.id != compare.id) {
        if (!(table.x < compare.x + compare.width &&
          table.x + table.width > compare.x &&
          table.y < compare.y + compare.height &&
          table.height + table.y > compare.y)){
          count++;
        }
      } else {
        count++;
      }
    })

    return count != tables.length;
  }

  detectOutOfBounds(element: Table, canvas: any) {
    return (element.x < 10 || element.y < 10 || element.x + element.width > canvas.width - 10 || element.y + element.height > canvas.height -10);
  }
}
