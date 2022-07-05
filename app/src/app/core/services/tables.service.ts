import {Injectable} from "@angular/core";
import {Table} from "../models/table.model";
import {BehaviorSubject, filter, map, Observable, of} from "rxjs";
import {createHttpObservable} from "./util";

@Injectable({
  providedIn: 'root'
})
export class TablesService {

  private subject = new BehaviorSubject(<Table[]>([]))
  tables$: Observable<Table[]> = this.subject.asObservable();

  constructor() {
  }


  init() {

    const tables$ = createHttpObservable('/tables');
    tables$.subscribe(tables => this.subject.next(tables))

  }

  saveTablesLocally(tables: Table[]) {
    this.subject.next(tables);
  }

  addTableRemote(table: Table) {
    fetch(`/api/add_table`, {
      method: 'POST',
      body: JSON.stringify(table),
      headers: {
        'content-type': 'application/json'
      }
    }).then(r => console.log('new table saved'))
  }

  modifyTable(table: Table) {
    fetch('/api/save_table', {
      method:'PUT',
      body: JSON.stringify(table),
      headers: {
        'content-type': 'application/json'
      }
    }).then(r => console.log(table))
  }

  clearSelected() {

    const tables = this.subject.getValue();
    const newTables = tables.map(table => table = {...table, ...{selected: false}});
    this.subject.next(newTables);

  }

  deleteTable(selectedTable: Table) {

    const tables = this.subject.getValue();
    const newTables = tables.filter(table => table.tableId != selectedTable.tableId);
    this.subject.next(newTables);

  }
}
