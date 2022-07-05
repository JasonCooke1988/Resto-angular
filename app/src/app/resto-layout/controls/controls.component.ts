import {Component, Output, EventEmitter, Input} from '@angular/core';
import {Table} from "../../core/models/table.model";
import {popInAnimation} from "../../animation";
import * as mongoose from "mongoose";

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  animations: [popInAnimation]
})
export class ControlsComponent {

  @Output() newTableEvent = new EventEmitter<Table>();
  @Output() deleteTableEvent = new EventEmitter<Table>();
  @Input() tables!: Table[];
  @Input() alert!: String | undefined;
  @Input() selectedTable?: Table | null = null;

  constructor() {
  }

  addNewTable() {

    let lastId = 0;

    if (this.tables.length) {

      this.tables.sort((a, b) => {
        return a.tableId - b.tableId;
      })

      lastId = this.tables[this.tables.length - 1].tableId;

    }

    console.log('coucou')
    console.log(lastId)

    const _id = new mongoose.Types.ObjectId();

    this.newTableEvent.emit(
      {
        _id: _id,
        tableId: lastId + 1,
        width: 50,
        height: 50,
        x: 0,
        y: 0,
        tableNumber: 0,
        seats: 0,
        selected: true,
        hovering: false
      }
    );
  }

  copyTable() {

    this.tables!.sort((a, b) => {
      return a.tableId - b.tableId;
    })

    const _id = new mongoose.Types.ObjectId();

    this.newTableEvent.emit(
      {
        _id: _id,
        tableId: this.tables![this.tables!.length - 1].tableId + 1,
        width: this.selectedTable!.width,
        height: this.selectedTable!.height,
        x: 0,
        y: 0,
        tableNumber: this.selectedTable!.tableNumber,
        seats: this.selectedTable!.seats,
        selected: true,
        hovering: false,
      }
    )
  }

  deleteTable() {

    this.tables!.forEach(table => {
        if (table.tableId === this.selectedTable!.tableId) {
          this.deleteTableEvent.emit(table);
        }
      }
    )
  }

}
