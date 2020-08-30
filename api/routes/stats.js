const express = require("express");
const router = express.Router();
const StatsController = require("../controllers/StatsController");

router.get("/portAuthority", StatsController.getPortAuthorityStats);
router.get("/customer", StatsController.getCustomerStats);

module.exports = router;
