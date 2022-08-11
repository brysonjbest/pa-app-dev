/*!
 * Table router
 * File: registration.router.js
 * Copyright(c) 2022 BC Gov
 * MIT Licensed
 */

const express = require("express");
const router = express.Router();
const tableController = require("../controllers/table.controller");

/**
 * Table routes.
 */

router.post("/seating", tableController.createTable);
router.post("/seating/:id", tableController.updateTable);
router.post("/seating/delete/:id", tableController.deleteTable);
router.post("/seating/newevent", tableController.createTableSet);

router.get("/seating", tableController.getAllTables);
router.get("/seating/:id/", tableController.getTable);
router.get("/seating/:id/guests", tableController.getTableGuests);

module.exports = router;
