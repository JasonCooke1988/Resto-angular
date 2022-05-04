import {Component, Input, OnInit} from '@angular/core';
import {Table} from "../../../../core/models/table.model";
import {Context} from "vm";

@Component({
  template: `
    <p>I am a table</p>
  `,
  selector: 'app-table'
})
export class TableComponent implements OnInit {
  table!: Table;
  constructor() { }

  ngOnInit(): void {
  }

}
