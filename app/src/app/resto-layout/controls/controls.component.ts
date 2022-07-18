import {Component, Output, EventEmitter, Input} from '@angular/core';
import {Table} from "../../core/models/table.model";
import {popInAnimation} from "../../animation";
import * as mongoose from "mongoose";
import {LayoutState} from "../../core/models/layoutState.model";

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  animations: [popInAnimation],
  styleUrls:['controls.component.scss']
})
export class ControlsComponent {

  @Output() newTableEvent = new EventEmitter<Table>();
  @Output() deleteTableEvent = new EventEmitter<Table>();
  @Output() saveLayoutEvent = new EventEmitter();
  @Input() tables!: Table[];
  @Input() alert!: String | undefined;
  @Input() selectedTable?: Table | null = null;
  @Input() layoutState!: LayoutState;

  addNewTable() {

    let lastId = 0;

    if (this.tables.length) {

      this.tables.sort((a, b) => {
        return a.tableId - b.tableId;
      })

      lastId = this.tables[this.tables.length - 1].tableId;

    }

    const _id = new mongoose.Types.ObjectId();

    this.newTableEvent.emit(
      {
        _id: _id,
        tableId: lastId + 1,
        width: 5,
        height: 5,
        x: 0,
        y: 0,
        calcX: 0,
        calcY: 0,
        calcHeight: 0,
        calcWidth: 0,
        seats: 0,
        selected: true,
        hovering: false,
        tableNumber: 0
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
        calcX: 0,
        calcY: 0,
        calcHeight: 0,
        calcWidth: 0,
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

  saveLayout() {
    this.saveLayoutEvent.emit();
  }
}
