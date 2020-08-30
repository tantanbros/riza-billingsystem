const express = require("express");
const router = express.Router();
const InvoicesController = require("../controllers/InvoicesController");

/** Create Invoice */
router.post("/", InvoicesController.createInvoice);

//TODO: All invoices, and invoice by customer
/** Get Invoices */
router.get("/", InvoicesController.getInvoices);

/** Update Invoice Status */
router.patch("/:invoiceId", InvoicesController.updateStatus);

module.exports = router;
