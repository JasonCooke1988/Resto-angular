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
    if (this.checkPropertyChange(value, true)) {
      if (value === 'width') {
        this.interval = setInterval(() =>
          this.checkPropertyChange(value, true) ?
          this.table.width += this.incrementValue : this.stopInterval(), 100)
      } else if (value === 'height') {
        this.interval = setInterval(() =>
          this.checkPropertyChange(value, true) ?
          this.table.height += this.incrementValue : this.stopInterval(), 100)
      }
    }
  }

  reduceProperty(value: string) {
    if (this.checkPropertyChange(value, true)) {
      if (value === 'width') {

        this.interval = setInterval(() =>
          this.checkPropertyChange(value, false) ?
            this.table.width -= this.incrementValue :
            this.stopInterval(), 100)

      } else if (value === 'height') {

        this.interval = setInterval(() =>
          this.checkPropertyChange(value, false) ?
            this.table.height -= this.incrementValue :
            this.stopInterval(), 100)

      }
    }
  }

  incrementPropertyOnce(value: string) {
    if (this.checkPropertyChange(value, true)) {
      if (value === 'width') {
        this.table.width += this.incrementValue;
      } else if (value === 'height') {
        this.table.height += this.incrementValue;
      }
    }
  }

  reducePropertyOnce(value: string) {
    if (this.checkPropertyChange(value, false)) {
      if (value === 'width') {
        this.table.width -= this.incrementValue;
      } else if (value === 'height') {
        this.table.height -= this.incrementValue;
      }
    }
  }

  checkPropertyChange(value: string, increment: boolean) {
    if (value === 'width') {

      let newWidth = increment ? this.table.width + this.incrementValue : this.table.width - this.incrementValue;
      return newWidth >= this.valueMin.width && newWidth <= this.valueMax.width;

    } else if (value === 'height') {

      let newHeight = increment ? this.table.height + this.incrementValue : this.table.height - this.incrementValue;
      return newHeight >= this.valueMin.height && newHeight <= this.valueMax.height;

    }

    return false;
  }

  stopInterval() {
    clearInterval(this.interval);
  }
}
