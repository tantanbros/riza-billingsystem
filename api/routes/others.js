const express = require("express");
const router = express.Router();
const UsersController = require("../controllers/UsersController");

/** Get a Biller ID */
router.get("/biller", UsersController.getBillerId);

module.exports = router;
