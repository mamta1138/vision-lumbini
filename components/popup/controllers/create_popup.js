const path = require("path");
const Popup = require("../models/popup_models");
const popupValidation = require("../helper/popup_validator");
const multer = require("multer");
const { storage } = require("../../../config/cloudinary");
const upload = multer({ storage });

const createPopup = async (req, res) => {
  try {
    const { error, value } = popupValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const image = req.file?.path;
    const originalName = req.file?.originalname;

    if (!image || !originalName) {
      return res.status(400).json({ message: "Image is required." });
    }

    const ext = path.extname(originalName).toLowerCase();
    const allowedExts = [".jpg", ".jpeg", ".png", ".webp"];
    const size = req.file?.size;
    const maxSize = 2 * 1024 * 1024;
    if (size > maxSize) {
      return res.status(400).json({
        message: "Image size must be 2MB or less.",
      });
    }

    if (!allowedExts.includes(ext)) {
      return res.status(400).json({
        message: "Invalid image format. Only .jpg, .jpeg, .png, and .webp are allowed.",
      });
    }

    const newPopup = new Popup({
      ...value,
      image: image,
    });

    await newPopup.save();

    return res.status(201).json({
      message: "Popup created successfully",
      popup: newPopup,
    });
  } catch (err) {
    console.error("Create Popup Error:", err);
    return res.status(500).json({
      message: "Server error while creating popup",
    });
  }
};

module.exports = { createPopup, upload };
