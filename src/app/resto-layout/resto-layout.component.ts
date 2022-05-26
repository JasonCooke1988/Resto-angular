import {Component, OnInit} from '@angular/core';
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

  constructor(private tableService: TablesService,
              private canvasService: CanvasService) {
  }

  ngOnInit(): void {
    this.tables = this.tableService.getAllTables();
  }

  addTable(newTable: Table) {

    let checked = 0;
    this.tables.forEach(compare => {
      if (!this.canvasService.detectOverlap(newTable, compare)) {
        checked++;
      }
    })

    if (checked === this.tables.length) {
      this.tables.push(newTable);
    }
  }

  selectTable(table: Table) {
    this.selectedTable = table;
  }

}
