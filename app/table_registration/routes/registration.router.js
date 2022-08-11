/*!
 * Registration router
 * File: registration.router.js
 * Copyright(c) 2022 BC Gov
 * MIT Licensed
 */

const express = require("express");
const router = express.Router();
const registrationController = require("../controllers/registration.controller");
const tableController = require("../controllers/table.controller");
//const {authorizeAdmin, authorizeSuperAdmin} = require('../services/auth.services')

/**
 * Registration routes.
 */

router.post("/registrations", registrationController.registerTable);
router.post("/registrations/:id", registrationController.updateTable);
router.post(
  "/registrations/delete/:id",
  registrationController.deleteRegistration
);
router.post("/guests", registrationController.registerGuest);
router.post("/guests/:id", registrationController.updateGuest);
router.post("/guests/delete/:id", registrationController.deleteGuest);
router.get("/guests", registrationController.getAllGuests);
router.get("/registrations", registrationController.getAllRegistrations);
router.get("/registrations/:id/", registrationController.getRegistration);
router.get(
  "/registrations/:id/guests",
  registrationController.getRegistrationGuests
);

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
