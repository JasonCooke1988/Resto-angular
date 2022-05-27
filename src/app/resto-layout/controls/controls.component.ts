import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {Table} from "../../core/models/table.model";
import {TablesService} from "../../core/services/tables.service";

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
})
export class ControlsComponent {

  @Output() newTableEvent = new EventEmitter<Table>()
  @Output() deleteTableEvent = new EventEmitter<Table>()
  @Input() tables!: Table[];
  @Input() alert!: String | undefined;
  @Input() selectedTable!: Table | undefined;

  constructor(private tableService: TablesService) {
  }

  addNewTable() {

    this.tables.sort((a, b) => {
      return a.id - b.id;
    })

    const lastId = this.tables[this.tables.length - 1].id;

    this.newTableEvent.emit(
      {
        id: lastId + 1,
        width: 50,
        height: 50,
        x: 0,
        y: 0,
        tableNumber: 0,
        seats: 0,
        selected: true
      }
    );
  }

  copyTable() {

    this.tables.sort((a, b) => {
      return a.id - b.id;
    })

    const lastId = this.tableService.getNewTableID();

    this.newTableEvent.emit(
      {
        id: lastId + 1,
        width: this.selectedTable!.width,
        height: this.selectedTable!.height,
        x: 0,
        y: 0,
        tableNumber: this.selectedTable!.tableNumber,
        seats: this.selectedTable!.seats,
        selected: true
      }
    )
  }

  deleteTable() {

    this.tables.forEach( table => {
        if(table.id === this.selectedTable!.id) {
          this.deleteTableEvent.emit(table);
        }
      }
    )
  }

}
