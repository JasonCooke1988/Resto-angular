import {Component, Input, OnInit} from '@angular/core';
import {Table} from "../../core/models/table.model";

@Component({
  selector: 'app-table-detail',
  templateUrl: './table-detail.component.html',
})
export class TableDetailComponent implements OnInit {

  @Input() tables!: Table[];

  constructor() { }

  ngOnInit(): void {
  }

}
