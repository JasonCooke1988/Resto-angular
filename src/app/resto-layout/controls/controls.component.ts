import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {Table} from "../../core/models/table.model";

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
})
export class ControlsComponent implements OnInit {


  @Output() newTableEvent = new EventEmitter<Table>()

  constructor() {
  }

  ngOnInit(): void {
  }

  addNewTable() {
    this.newTableEvent.emit(
      {
        width: 30,
        height: 30,
        x: 150,
        y: 150,
        isDragging: false,
        selected: true
      }
    );
  }
}
