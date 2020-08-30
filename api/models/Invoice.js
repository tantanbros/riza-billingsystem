let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let InvoiceSchema = new Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  biller: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: Schema.Types.String,
    enum: ["Sent", "Paid"],
    default: "Sent",
  },
  dateSent: {
    type: Schema.Types.Date,
    default: Date.now,
  },
  datePaid: {
    type: Schema.Types.Date,
  },
  totalAmount: {
    type: Schema.Types.Number,
  },
  billingItems: [
    {
      type: Schema.Types.ObjectId,
      ref: "BillingItem",
    },
  ],
});

module.exports = mongoose.model("Invoice", InvoiceSchema);
