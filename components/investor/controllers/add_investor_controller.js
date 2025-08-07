const Investor = require("../models/InvestorModel");
const investorValidation = require("../helper/investor_validator");
const multer = require("multer");
const { storage } = require("../../../config/cloudinary");
const upload = multer({ storage });

const allowedImageMimeTypes = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml", "image/webp"];

const addInvestor = async (req, res) => {
  try {
    const passportPhotoFile = req.files?.passportPhoto?.[0];
    const verifyingDocumentsFiles = req.files?.verifyingDocuments || [];

    if (!passportPhotoFile) {
      return res.status(400).json({ message: "Passport photo is required" });
    }

    if (!allowedImageMimeTypes.includes(passportPhotoFile.mimetype)) {
      return res.status(400).json({ message: "Passport photo must be a valid image (jpg, jpeg, png, svg, webp)" });
    }

    if (!verifyingDocumentsFiles.length) {
      return res.status(400).json({ message: "At least one verifying document is required" });
    }

    const passportPhoto = passportPhotoFile.path;
    const verifyingDocuments = verifyingDocumentsFiles.map(file => file.path);

    req.body.documents = { passportPhoto, verifyingDocuments };
    req.body.isSameAsPermanentAddress = req.body.isSameAsPermanentAddress === "true";

    if (req.body.isSameAsPermanentAddress) {
      req.body.temporaryAddress = { ...req.body.permanentAddress };
    }

    const { error, value } = investorValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const newInvestor = new Investor({ ...value, status: "pending" });
    await newInvestor.save();

    return res.status(201).json({ message: "Application submitted successfully", item: newInvestor });

  } catch (error) {
    console.error("Add Investor Error:", error.message);
    return res.status(500).json({ message: "Failed to add investor" });
  }
};

module.exports = { addInvestor, upload };
