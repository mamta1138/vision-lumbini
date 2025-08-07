const Investor = require("../models/InvestorModel");

const deleteInvestor = async (req, res) => {
  const { id } = req.params;

  try {

    const investor = await Investor.findById(id);
    if (!investor) {
      return res.status(404).json({ message: "Investor not found" });
    }

    await Investor.findByIdAndDelete(id);

    return res.status(200).json({ message: "Investor deleted successfully" });
  } catch (error) {
    console.error("Delete Investor Error:", error.message);
    return res.status(500).json({ message: "Failed to delete investor" });
  }
};

module.exports = deleteInvestor;
