const express = require("express");
const router = express.Router();
const FilesController = require("../controllers/FilesController");

/** Get File by fileName */
router.get("/:fileName", FilesController.getFile);

module.exports = router;
