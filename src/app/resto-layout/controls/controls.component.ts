import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {Table} from "../../core/models/table.model";
import {TablesService} from "../../core/services/tables.service";

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
})
export class ControlsComponent {

  @Output() newTableEvent = new EventEmitter<Table>()
  @Input() tables!: Table[];

  constructor(private tableService: TablesService) {
  }

  addNewTable() {

    this.tables.sort((a,b) => {
      return a.id - b.id;
    })

    const lastId = this.tables[this.tables.length - 1].id;

    this.newTableEvent.emit(
      {
        id: lastId + 1,
        width: 30,
        height: 30,
        x: 150,
        y: 150,
        tableNumber: 0,
        seats: 0,
        selected: true
      }
    );
  }
}
