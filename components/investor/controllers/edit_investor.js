const mongoose = require("mongoose");
const Investor = require("../models/InvestorModel");
const investorValidation = require("../helper/investor_validator");

const allowedImageMimeTypes = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml", "image/webp"];

const editInvestor = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid investor ID format" });
    }

    const existingInvestor = await Investor.findById(id);
    if (!existingInvestor) {
      return res.status(404).json({ message: "Investor not found" });
    }

    const passportPhotoFile = req.files?.passportPhoto?.[0];
    const verifyingDocumentsFiles = req.files?.verifyingDocuments || [];

    if (passportPhotoFile && !allowedImageMimeTypes.includes(passportPhotoFile.mimetype)) {
      return res.status(400).json({
        message: "Passport photo must be a valid image (jpg, jpeg, png, svg, webp)"
      });
    }

    const passportPhoto = passportPhotoFile?.path;
    const verifyingDocuments = verifyingDocumentsFiles.map(file => file.path);

    const {
      _id,
      __v,
      createdAt,
      updatedAt,
      ...cleanedExistingData
    } = existingInvestor.toObject();

    const updatedData = {
      ...cleanedExistingData,
      ...req.body,
    };

    if (passportPhoto || verifyingDocuments?.length) {
      updatedData.documents = {
        ...cleanedExistingData.documents,
        ...(passportPhoto && { passportPhoto }),
        ...(verifyingDocuments?.length && { verifyingDocuments }),
      };
    }

    updatedData.isSameAsPermanentAddress = req.body.isSameAsPermanentAddress === "true";

    if (updatedData.isSameAsPermanentAddress && updatedData.permanentAddress) {
      updatedData.temporaryAddress = { ...updatedData.permanentAddress };
    }

    const { error, value } = investorValidation.validate(updatedData);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const updatedInvestor = await Investor.findByIdAndUpdate(
      id,
      value,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      message: "Investor application updated successfully",
      item: updatedInvestor
    });

  } catch (err) {
    console.error("Edit Investor Error:", err.message);
    return res.status(500).json({ message: "Failed to update investor" });
  }
};

module.exports = editInvestor;
