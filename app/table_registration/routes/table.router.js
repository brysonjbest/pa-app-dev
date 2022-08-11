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

router.post("/tables", tableController.createTable);
router.post("/tables/:id", tableController.updateTable);
router.post("/tables/delete/:id", tableController.deleteTable);

router.get("/tables", tableController.getAllTables);
router.get("/tables/:id/", tableController.getTable);
router.get("/tables/:id/guests", tableController.getTableGuests);

module.exports = router;
