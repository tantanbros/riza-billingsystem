const mongoose = require("mongoose");
const User = require("../models/User");
const Invoice = require("../models/Invoice");
const BillingItem = require("../models/BillingItem");
const selectFields = require("../helpers/selectFields");
const parallel = require("async/parallel");

exports.createInvoice = async (req, res, next) => {
  const invoiceToCreate = req.body;
  const customerId = invoiceToCreate.customer;
  const billerId = invoiceToCreate.biller;

  // customerId and billerId must be valid ObjectIds
  const isValid =
    mongoose.Types.ObjectId.isValid(customerId) &&
    mongoose.Types.ObjectId.isValid(billerId);
  if (!isValid) {
    return res.status(404).json({ message: "User not found" });
  }

  try {
    parallel(
      {
        customer: function (callback) {
          User.findById(customerId).select(selectFields.User).exec(callback);
        },
        biller: function (callback) {
          User.findById(billerId).select(selectFields.User).exec(callback);
        },
        billingItems: function (callback) {
          const billingItemsCreate = invoiceToCreate.billingItems.map(
            item => new BillingItem(item)
          );
          BillingItem.insertMany(billingItemsCreate)
            .then(doc => {
              callback(null, doc);
            })
            .catch(err => {
              callback(err);
            });
        },
      },
      async function (err, { customer, biller, billingItems }) {
        if (err) throw err;

        // if either customer or biller is not found, we can't create the invoice
        if (!customer || !biller) {
          return res.status(404).json({ message: "User not found" });
        }

        const invoice = new Invoice({
          customer,
          biller,
          billingItems,
          totalAmount: invoiceToCreate.totalAmount,
        });

        const doc = await invoice.save();
        console.log("Saved", { doc });
        res.status(200).json(doc);
      }
    );
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "There was an error in the database" });
  }
};

exports.getInvoices = async (req, res, next) => {
  const { customerId } = req.query;
  if (customerId) {
    // get invoices of specific customer
    const isValid = mongoose.Types.ObjectId.isValid(customerId);
    if (!isValid) {
      return res.status(404).json({ message: "User not found" });
    }
    try {
      const invoices = await Invoice.find({ customer: { _id: customerId } })
        .populate("customer", selectFields.User)
        .populate("biller", selectFields.User)
        .populate("billingItems")
        .sort({ dateSent: -1 });
      res.json(invoices);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "There was an error in the database" });
    }
  } else {
    // no query string return all
    try {
      const invoices = await Invoice.find()
        .populate("customer", selectFields.User)
        .populate("biller", selectFields.User)
        .populate("billingItems")
        .sort({ dateSent: -1 });
      res.json(invoices);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "There was an error in the database" });
    }
  }
};

exports.updateStatus = async (req, res, next) => {
  const { invoiceId } = req.params;
  const invoiceToPatch = req.body;
  try {
    const doc = await Invoice.updateOne(
      { _id: invoiceId },
      { ...invoiceToPatch }
    );
    console.log(doc);
    // no user matched the userId provided, we return a not found
    if (doc.n < 1) {
      return res.sendStatus(404);
    }
    res.sendStatus(204);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "There was an error in the database" });
  }
};
