const mongoose = require("mongoose");
const Investor = require("../models/InvestorModel");

const updateInvestor = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid investor ID format" });
    }

    const validStatuses = ["pending", "approved", "rejected"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid or missing status value. Must be 'pending', 'approved', or 'rejected'.",
      });
    }

    const existingInvestor = await Investor.findById(id);
    if (!existingInvestor) {
      return res.status(404).json({ message: "Investor not found" });
    }

    const updatedInvestor = await Investor.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      message: "Investor status updated successfully",
      item: updatedInvestor,
    });
  } catch (error) {
    console.error("Update Investor Error:", error.message);
    return res.status(500).json({ message: "Failed to update investor" });
  }
};

module.exports = updateInvestor;
