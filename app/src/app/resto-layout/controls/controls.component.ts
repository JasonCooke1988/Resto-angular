import {Component, Output, EventEmitter, Input} from '@angular/core';
import {Table} from "../../core/models/table.model";
import {popInAnimation} from "../../animation";
import * as mongoose from "mongoose";
import {LayoutState} from "../../core/models/layoutState.model";
import {CanvasService} from "../../core/services/canvas.service";

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

  constructor(private canvasService: CanvasService) {
  }

  addNewTable() {

    const table = new Table(this.canvasService.calcLastTableId());
    this.newTableEvent.emit(table);

  }

  copyTable() {

    let table = Object.assign(new Table(this.canvasService.calcLastTableId()),{width:this.selectedTable!.width, height: this.selectedTable!.height})
    table = this.canvasService.tablesCalcRelativeValues(table, this.layoutState['layout']);
    this.newTableEvent.emit(table)

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
