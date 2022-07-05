const mongoose = require("mongoose");

const TableSchema = new mongoose.Schema({
    tableId : {
      type: Number,
      required: true
    },
    width: {
        type: String,
        required: true,
    },
    height: {
        type: String,
        required: true,
    },
    x: {
        type: Number,
        default: 0,
    },
    y: {
        type: Number,
        default: 0,
    },
    tableNumber: {
        type: Number,
        default: 0,
    },
    seats: {
        type: Number,
        default: 0,
    },
});

const tableModel = mongoose.model("Table", TableSchema);

module.exports = tableModel;
