import * as mongoose from "mongoose";

export class Table {
  _id: mongoose.Types.ObjectId;
  tableId: number;
  width: number = 1;
  height: number = 1;
  x: number = 0;
  y: number = 0;
  calcX: number = 0;
  calcY: number = 0;
  calcWidth: number = 0;
  calcHeight: number = 0;
  tableNumber: number = 0;
  seats: number = 0;
  selected: Boolean = false;
  hovering: Boolean = false;

  constructor(tableId: number) {
    this._id = new mongoose.Types.ObjectId();
    this.tableId = tableId;
  }
}
