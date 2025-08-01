const { required } = require("joi");
const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    fiscalYear: {
      type: String,
      match: [/^\d{4}\/\d{2}$/, "Fiscal year must be in format YYYY/YY"], 
    },
    quarter: {
      type: String,
      enum: ["Quarter-1", "Quarter-2", "Quarter-3", "Quarter-4", ""],
      allowNull: true
    },
    
    file: { 
      type: String, 
      trim: true, 
      default: "" 
    },
    status: {
      type: String, 
      enum: ["pending", "approved"], 
      default: "pending", 
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
