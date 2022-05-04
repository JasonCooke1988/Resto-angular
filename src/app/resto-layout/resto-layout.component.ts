import {Component, OnInit} from '@angular/core';
import {Table} from "../core/models/table.model";
import {TablesService} from "../core/services/tables.service";
import {CanvasService} from "../core/services/canvas.service";

@Component({
  selector: 'app-resto-layout',
  templateUrl: './resto-layout.component.html',
})
export class RestoLayoutComponent implements OnInit {
  tables!: Table[];

  constructor(private tableService: TablesService, private canvasService: CanvasService) {
  }

  ngOnInit(): void {
    this.tables = this.tableService.getAllTables();
  }

  addTable(newTable: Table) {
    let pass = this.noOverlappingTable(newTable);

    if (pass) {
      this.tables.push(newTable);
    }
  }

  noOverlappingTable(newTable: Table) {

    return this.tables.every(element => {

      return this.canvasService.detectOverlap(newTable, element);
    });
  }

}
