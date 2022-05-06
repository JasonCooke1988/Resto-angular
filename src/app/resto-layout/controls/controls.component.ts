import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {Table} from "../../core/models/table.model";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {TablesService} from "../../core/services/tables.service";

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
})
export class ControlsComponent implements OnInit {

  @Output() newTableEvent = new EventEmitter<Table>()
  @Input() tables!: Table[];

  constructor(private tableService: TablesService) {
  }

  ngOnInit() {

    // this.snapForm = this.formBuilder.group({
    //   x: [null, [Validators.required]],
    //   y: [null, [Validators.required]],
    //   width: [null, [Validators.required]],
    //   height: [null, [Validators.required]],
    //   tableNumber: [null, [Validators.required]],
    //   seats: [null, [Validators.required]]
    // })

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
        isDragging: false,
        selected: true
      }
    );
  }
}
