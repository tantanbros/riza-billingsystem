let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let BillingItemSchema = new Schema({
  description: {
    type: Schema.Types.String,
    required: true,
  },
  amount: {
    type: Schema.Types.String,
    required: true,
  },
});

module.exports = mongoose.model("BillingItem", BillingItemSchema);
