let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let UserSchema = new Schema({
  firstName: {
    type: Schema.Types.String,
    required: true,
  },
  lastName: {
    type: Schema.Types.String,
    required: true,
  },
  email: {
    type: Schema.Types.String,
    required: true,
    unique: true,
  },
  password: {
    type: Schema.Types.String,
    required: true,
  },
  role: {
    type: Schema.Types.String,
    enum: ["Customer", "PortAuthority"],
    default: "Customer",
  },
  complaints: [
    {
      type: Schema.Types.ObjectId,
      ref: "Complaint",
    },
  ],
  invoices: [
    {
      type: Schema.Types.ObjectId,
      ref: "Invoice",
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
