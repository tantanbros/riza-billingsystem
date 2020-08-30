const mongoose = require("mongoose");
const User = require("../models/User");
const Complaint = require("../models/Complaint");
const selectFields = require("../helpers/selectFields");

exports.createComplaint = async (req, res, next) => {
  const complaintToCreate = req.body;
  const complainantId = complaintToCreate.complainant;

  // given complainantId was invalid, return not found since its still not found
  const isValid = mongoose.Types.ObjectId.isValid(complainantId);
  if (!isValid) {
    return res.status(404).json({ message: "User not found" });
  }

  try {
    const complainant = await User.findById(complainantId);

    // given userId was not found, so return
    if (!complainant) {
      return res.status(404).json({ message: "User not found" });
    }

    // we can now add the complaint to the complainant
    const complaint = new Complaint(complaintToCreate);

    const doc = await complaint.save();
    console.log("Saved", { doc });
    res.status(200).json(doc);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "There was an error in the database" });
  }
};

exports.getComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find()
      .populate("complainant", selectFields.User)
      .sort({ dateSubmitted: -1 });
    res.json(complaints);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "There was an error in the database" });
  }
};
