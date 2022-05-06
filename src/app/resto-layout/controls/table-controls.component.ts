import {Component, Input, OnInit} from "@angular/core";
import {Table} from "../../core/models/table.model";

@Component({
  selector: 'app-table-controls',
  templateUrl: 'table-controls.component.html'
})
export class TableControlsComponent implements OnInit {
  incrementValue!: number;
  interval!: any;
  valueMin!: any;
  valueMax!: any;

  @Input() table!: Table;

  ngOnInit() {
    this.incrementValue = 10;

    this.valueMin = {
      'width': 50,
      'height': 50,
    }

    this.valueMax = {
      'width': 250,
      'height': 250,
    }
  }

  incrementProperty(value: string) {
    let table = this.table;
    if ((table[value] + this.incrementValue) <= this.valueMin &&
      // @ts-ignore
      (this.table[value] + this.incrementValue) >= this.valueMax) {
      // @ts-ignore
      this.interval = setInterval(() => this.table[value] += this.incrementValue, 100)
    }
  }

  reduceProperty(value: string) {
    // @ts-ignore
    this.interval = setInterval(() => this.table[value] -= this.incrementValue, 100)
  }

  incrementPropertyOnce(value: string) {
    // @ts-ignore
    this.table[value] += this.incrementValue;
  }

  reducePropertyOnce(value: string) {
    // @ts-ignore
    this.table[value] -= this.incrementValue;
  }

  stopInterval() {
    clearInterval(this.interval);
  }
}
