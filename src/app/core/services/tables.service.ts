import {Injectable} from "@angular/core";
import {Table} from "../models/table.model";
import { Observable, of} from "rxjs";

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
}
