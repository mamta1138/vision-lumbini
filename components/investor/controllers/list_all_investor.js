const Investor = require("../models/InvestorModel");

const listAllInvestors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortOrder = req.query.sort === "asc" ? 1 : -1; 

    const search = req.query.search || "";
    const status = req.query.status || "";

    const searchQuery = {
      ...(search && {
        fullName: { $regex: search, $options: "i" }
      }),
      ...(status && { status })
    };

    const Investors = await Investor.find(searchQuery)
      .sort({ createdAt: sortOrder }) 
      .skip(skip)
      .limit(limit)
      .lean();

    const totalInvestors = await Investor.countDocuments(searchQuery)

    return res.status(200).json({
      message: "Investors fetched successfully",
      Investors,
      pagination: {
        currentPage: page,
        totalInvestors,
        totalPages: Math.ceil(totalInvestors / limit),
        InvestorsPerPage: limit,
      },
    });

  } catch (error) {
    console.error("List All Investors Error:", error.message);
    return res.status(500).json({ message: "Failed to fetch investors" });
  }
};

const listInvestor = async (req, res) => {
  let investorId = req.params.id;
  try {
    let item = await Investor.findById(investorId);
    if (!item) {
      return res.status(404).json({ message: "Investor not found" });
    }
    return res.status(200).json({
      status: "success",
      item,
    });
  } catch (error) {
    console.error("List Investor Error:", error.message);
    return res.status(500).json({ message: "Failed to fetch investor" });
  }
};

module.exports = { listAllInvestors, listInvestor };
