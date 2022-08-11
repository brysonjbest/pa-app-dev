/*!
 * Table db model
 * File: Table.model.js
 * Copyright(c) 2022 BC Gov
 * MIT Licensed
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Table schema
 */

const TableSchema = new Schema(
  {
    guid: {
      type: String,
      required: true,
      unique: true,
    },
    guests: [
      {
        type: Schema.Types.ObjectId,
        ref: "Guest",
      },
    ],
    tablename: {
      type: String,
      required: true,
    },
    tableCapacity: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const TableModel = mongoose.model("Table", TableSchema, "tables");
module.exports = TableModel;
