const Report = require("../models/report_model");
const reportValidator = require("../helper/report_validator");
const path = require("path");
const multer = require("multer");
const { storage } = require("../../../config/cloudinary");
const upload = multer({ storage });

const createReport = async (req, res) => {
  try {
    const { error, value } = reportValidator.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const existingReport = await Report.findOne({ title: value.title });
    if (existingReport) {
      return res.status(409).json({ message: "A report with this title already exists. Please choose different name." });
    }

    const fileUrl = req.file?.path || "";
    const originalName = req.file?.originalname;
    const fileSize = req.file?.size;

    if (!fileUrl || !originalName || !fileSize) {
      return res.status(400).json({ message: '"file" is required.' });
    }

    const ext = path.extname(originalName).toLowerCase();
    const allowedExt = ".pdf";
    const maxSize = 5 * 1024 * 1024; 

    if (ext !== allowedExt) {
      return res.status(400).json({
        message: "Invalid file type. Only PDF files are allowed.",
      });
    }

    if (fileSize > maxSize) {
      return res.status(400).json({
        message: "File size must be 5MB or less.",
      });
    }

    const newReport = new Report({
      ...value,
      file: fileUrl,
    });

    await newReport.save();

    return res.status(201).json({
      message: "Report created successfully.",
      newReport,
    });

  } catch (error) {
    console.error("Create Report Error:", error);
    return res.status(500).json({ message: "Server error while creating report" });
  }
};

module.exports = { createReport, upload };
