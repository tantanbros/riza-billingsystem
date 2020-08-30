const express = require("express");
const router = express.Router();
const ComplaintsController = require("../controllers/ComplaintsController");

/** Create Complaint by User */
router.post("/", ComplaintsController.createComplaint);

/** Get Complaints */
router.get("/", ComplaintsController.getComplaints);

module.exports = router;
