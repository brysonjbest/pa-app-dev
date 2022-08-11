/*!
 * table controller
 * File: table.controller.js
 * Copyright(c) 2022 BC Gov
 * MIT Licensed
 */

const { default: mongoose } = require("mongoose");
const { genID } = require("../../services/validation.services.js");
const GuestModel = require("../models/guest.model.js");
const TableModel = require("../models/table.model.js");

/**
 * Retrieve all table data.
 *
 * @param req
 * @param res
 * @param next
 * @src public
 */

exports.getAllTables = async (req, res, next) => {
  try {
    const tables = await TableModel.find({});
    return res.status(200).json(tables);
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

exports.getTable = async (req, res, next) => {
  try {
    const id = req.params.id;
    let table;

    if (mongoose.Types.ObjectId.isValid(id)) {
      table = await TableModel.find({
        _id: id,
      });
    } else {
      table = await TableModel.find({
        guid: id,
      });
    }

    return res.status(200).json(table);
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

exports.getTableGuests = async (req, res, next) => {
  try {
    const id = req.params.id;

    // look up guests exist on table

    let guests;

    if (mongoose.Types.ObjectId.isValid(id)) {
      guests = await TableModel.find({
        _id: id,
      }).populate("guests");
    } else {
      guests = await TableModel.find({
        guid: id,
      }).populate("guests");
    }

    if (!guests) return next(Error("invalidInput"));

    return res.status(200).json(guests);
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

/**
 * Create new table
 *
 * @param req
 * @param res
 * @param {Function} next
 * @method post
 * @src public
 */

exports.createTable = async (req, res, next) => {
  try {
    const guid = genID();
    const { tablename = "", tablecapacity = null } = req.body || {};

    // insert new record into collection
    const table = await TableModel.create({
      guid,
      tablename,
      tablecapacity,
    });

    res.status(200).json(table);
  } catch (err) {
    return next(err);
  }
};

/**
 * Cycle through given table total and generate a set of tables
 *
 * @param req
 * @param res
 * @param {Function} next
 * @method post
 * @src public
 */

exports.createTableSet = async (req, res, next) => {
  try {
    const { guestCount = null } = req.bod || {};
    const tableCount = guestCount / 10;
    const tablecapacity = 10;
    const alphabet = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    let alphacount = 0;

    for (let each of tableCount) {
      const guid = genID();
      const tablename = `${alphabet[alphacount]}${each.toString()}`;
      await TableModel.create({
        guid,
        tablename,
        tablecapacity,
      });
    }

    res.status(200);
  } catch (err) {
    return next(err);
  }
};

/**
 * Update table data
 *
 * @param req
 * @param res
 * @param next
 * @src public
 */

exports.updateTable = async (req, res, next) => {
  try {
    const data = req.body;
    const id = req.params.id;

    // look up guest exists
    const table = await TableModel.findById(id);
    if (!table) return next(Error("invalidInput"));
    await TableModel.updateOne({ _id: id }, data);
    const newTable = await TableModel.findById(id);
    res.status(200).json(newTable);
  } catch (err) {
    return next(err);
  }
};

/**
 * Remove Table
 *
 * @param req
 * @param res
 * @param next
 * @src public
 */

/** 

exports.deleteTable = async (req, res, next) => {
  try {
    const id = req.params.id;

    // look up table exists
    const table = await TableModel.findById(id);
    if (!table) return next(Error("invalidInput"));

    const response = await TableModel.deleteOne({ _id: id });

    res.status(200).json(response);
  } catch (err) {
    return next(err);
  }
};

*/

/**
 * Removes table and resets all connected guests
 *
 * @param req
 * @param res
 * @param next
 * @src public
 */

exports.deleteTable = async (req, res, next) => {
  try {
    const id = req.params.id;

    // look up registration exists
    const table = await TableModel.findById(id);
    if (!table) return next(Error("invalidInput"));

    for (let each of table.guests) {
      const guestID = each._id;
      await GuestModel.updateOne({ _id: id }, { table: {} });
    }

    const response = await TableModel.deleteOne({ _id: id });

    res.status(200).json(response);
  } catch (err) {
    return next(err);
  }
};
