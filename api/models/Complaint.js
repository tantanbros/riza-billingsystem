let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let ComplaintSchema = new Schema({
  complainant: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  message: {
    type: Schema.Types.String,
    required: true,
  },
  dateSubmitted: {
    type: Schema.Types.Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Complaint", ComplaintSchema);
