const mongoose = require("mongoose");
const User = require("../models/User");
const Invoice = require("../models/Invoice");
const Complaint = require("../models/Complaint");

exports.getPortAuthorityStats = async (req, res, next) => {
  // Total Customers
  try {
    const totalCustomers = await User.countDocuments({
      role: { $regex: "Customer", $options: "i" }, // case insensitive
    });

    const complaintStats = (
      await Complaint.aggregate([
        {
          $facet: {
            Total: [{ $count: "Total" }],
            PastMonth: [
              {
                $match: {
                  dateSubmitted: {
                    $exists: true,
                    $lt: new Date(Date.now()),
                    $gte: () => {
                      let now = new Date(Date.now());
                      now.setDate(now.getDate() - 30);
                      return now;
                    },
                  },
                },
              },
              { $count: "PastMonth" },
            ],
          },
        },
        {
          $project: {
            total: { $arrayElemAt: ["$Total.Total", 0] },
            pastMonth: { $arrayElemAt: ["$PastMonth.PastMonth", 0] },
          },
        },
      ])
    )[0];

    const invoiceStats = (
      await Invoice.aggregate([
        {
          $facet: {
            Total: [
              { $match: { status: { $exists: true } } },
              { $count: "Total" },
            ],
            Paid: [
              { $match: { status: { $exists: true, $in: ["Paid"] } } },
              { $count: "Paid" },
            ],
            Unpaid: [
              { $match: { status: { $exists: true, $nin: ["Paid"] } } },
              { $count: "Unpaid" },
            ],
          },
        },
        {
          $project: {
            total: { $arrayElemAt: ["$Total.Total", 0] },
            paid: { $arrayElemAt: ["$Paid.Paid", 0] },
            unpaid: { $arrayElemAt: ["$Unpaid.Unpaid", 0] },
          },
        },
      ])
    )[0];

    res.json({
      totalCustomers,
      complaintStats,
      invoiceStats,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "There was an error in the database" });
  }
};

exports.getCustomerStats = async (req, res, next) => {
  try {
    const customerId = mongoose.Types.ObjectId(req.query.customerId);
    const invoices = await Invoice.find({ customer: { _id: customerId } });

    const total = invoices.length;
    const paid = invoices.filter(item => item.status.toLowerCase() === "paid")
      .length;
    const unpaid = invoices.filter(item => item.status.toLowerCase() === "sent")
      .length;

    res.json({ total, paid, unpaid });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "There was an error in the database" });
  }
};
