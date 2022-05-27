import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Table} from "../core/models/table.model";
import {TablesService} from "../core/services/tables.service";
import {CanvasService} from "../core/services/canvas.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-resto-layout',
  templateUrl: './resto-layout.component.html',
  styles: ['#canvas-wrap {height: 60vh;}']
})
export class RestoLayoutComponent implements OnInit {
  tables!: Table[];
  selectedTable!: Table | undefined;
  newTable!: Table | undefined;
  alert!: String | undefined;


  constructor(private tableService: TablesService,
              private canvasService: CanvasService) {
  }

  ngOnInit(): void {
    this.tables = this.tableService.getAllTables();
  }

  addTable(newTable: Table) {

    if (this.selectedTable != undefined) {
      this.selectedTable.selected = false;
    }

    this.newTable = newTable;
    this.selectedTable = newTable;
    this.alert = "Cliquez sur un emplacement libre pour placer la nouvelle table.";
  }

  selectTable(table: Table) {
    this.selectedTable = table;
  }

  clearNewTable() {
    this.alert = undefined;
    this.newTable = undefined;
  }

  clearSelectTable() {
    this.selectedTable!.selected = false;
    this.selectedTable = undefined;
  }

  deleteTable(table: Table) {

    let length = this.tables.length;

    this.tables = this.tables.filter(elt => {
      return elt.id != table.id;
    })

    let newLength = this.tables.length;

    if (length != newLength) {
      this.clearSelectTable();
    }
  }

}
