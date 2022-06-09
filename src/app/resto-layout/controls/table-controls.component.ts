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

  @Input() selectedTable!: Table;
  @Input() tables!: Table[];

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

  // incrementProperty(value: string) {
  //   if (this.checkPropertyChange(value, true)) {
  //     if (value === 'width') {
  //       this.interval = setInterval(() =>
  //         this.checkPropertyChange(value, true) ?
  //         this.selectedTable.width += this.incrementValue : this.stopInterval(), 100)
  //     } else if (value === 'height') {
  //       this.interval = setInterval(() =>
  //         this.checkPropertyChange(value, true) ?
  //         this.selectedTable.height += this.incrementValue : this.stopInterval(), 100)
  //     }
  //   }
  // }
  //
  // reduceProperty(value: string) {
  //   if (this.checkPropertyChange(value, true)) {
  //     if (value === 'width') {
  //
  //       this.interval = setInterval(() =>
  //         this.checkPropertyChange(value, false) ?
  //           this.selectedTable.width -= this.incrementValue :
  //           this.stopInterval(), 100)
  //
  //     } else if (value === 'height') {
  //
  //       this.interval = setInterval(() =>
  //         this.checkPropertyChange(value, false) ?
  //           this.selectedTable.height -= this.incrementValue :
  //           this.stopInterval(), 100)
  //
  //     }
  //   }
  // }
  //
  // incrementPropertyOnce(value: string) {
  //   if (this.checkPropertyChange(value, true)) {
  //     if (value === 'width') {
  //       this.selectedTable.width += this.incrementValue;
  //     } else if (value === 'height') {
  //       this.selectedTable.height += this.incrementValue;
  //     }
  //   }
  // }
  //
  // reducePropertyOnce(value: string) {
  //   if (this.checkPropertyChange(value, false)) {
  //     if (value === 'width') {
  //       this.selectedTable.width -= this.incrementValue;
  //     } else if (value === 'height') {
  //       this.selectedTable.height -= this.incrementValue;
  //     }
  //   }
  // }
  //
  // checkPropertyChange(value: string, increment: boolean) {
  //   if (value === 'width') {
  //
  //     let newWidth = increment ? this.selectedTable.width + this.incrementValue : this.selectedTable.width - this.incrementValue;
  //     return newWidth >= this.valueMin.width && newWidth <= this.valueMax.width;
  //
  //   } else if (value === 'height') {
  //
  //     let newHeight = increment ? this.selectedTable.height + this.incrementValue : this.selectedTable.height - this.incrementValue;
  //     return newHeight >= this.valueMin.height && newHeight <= this.valueMax.height;
  //
  //   }
  //
  //   return false;
  // }

  stopInterval() {
    clearInterval(this.interval);
  }
}
