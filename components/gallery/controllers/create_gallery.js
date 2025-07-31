const path = require("path");
const Gallery = require("../models/gallery_model");
const galleryValidation = require("../helper/gallery_validator");
const multer = require("multer");
const { storage } = require("../../../config/cloudinary");
const upload = multer({ storage });

const createGallery = async (req, res) => {
  try {
    const { error, value } = galleryValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: `Validation Error: ${error.details[0].message}`,
      });
    }

    const image = req.file?.path || null;
    const originalName = req.file?.originalname;
    const size = req.file?.size;

    // IMAGE VALIDATION
    if (value.type === "image") {
      if (!image || !originalName) {
        return res.status(400).json({
          message: "Validation Error: Image file is required when type is 'image'.",
        });
      }

      const ext = path.extname(originalName).toLowerCase();
      const allowedExts = [".jpg", ".jpeg", ".png", ".webp"];
      const maxSize = 2 * 1024 * 1024;

      if (!allowedExts.includes(ext)) {
        return res.status(400).json({
          message: "Invalid image format. Only .jpg, .jpeg, .png, and .webp are allowed.",
        });
      }

      if (size > maxSize) {
        return res.status(400).json({
          message: "Image size must be 2MB or less.",
        });
      }

      if (value.video_url && value.video_url.trim() !== "") {
        return res.status(400).json({
          message: "Validation Error: 'video_url' should be empty when type is 'image'.",
        });
      }
    }

    // VIDEO VALIDATION
    if (value.type === "video") {
      if (!value.video_url || value.video_url.trim() === "") {
        return res.status(400).json({
          message: "Validation Error: 'video_url' is required when type is 'video'.",
        });
      }

      if (image) {
        return res.status(400).json({
          message: "Validation Error: Image upload is not allowed when type is 'video'.",
        });
      }
    }

    const newGallery = new Gallery({
      ...value,
      image,
    });

    await newGallery.save();

    return res.status(201).json({
      message: "Gallery created successfully.",
      gallery: newGallery,
    });
  } catch (err) {
    console.error("Create Gallery Error:", err);

    // if (err.code === 11000 && err.keyPattern?.title) {
    //   return res.status(409).json({
    //     message: "Gallery title must be unique. This title already exists.",
    //   });
    // }

    return res.status(500).json({
      message: "Internal Server Error: Unable to create gallery.",
    });
  }
};

module.exports = { createGallery, upload };
