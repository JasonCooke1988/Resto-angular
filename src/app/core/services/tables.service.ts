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

  constructor() {
  }


  getTables(): Table[] {
    return this.tables;
  }

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
}
