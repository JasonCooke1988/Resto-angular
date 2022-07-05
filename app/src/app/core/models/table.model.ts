import * as mongoose from "mongoose";

export class Table {
  _id!: mongoose.Types.ObjectId;
  tableId!: number;
  width!: number;
  height!: number;
  x!: number;
  y!: number;
  tableNumber!: number;
  seats!: number;
  selected!: Boolean;
  hovering!: Boolean;
}
