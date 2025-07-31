const Testimonial = require("../models/testimonial_model");
const testimonialValidator = require("../helper/testimonial_validator");
const multer = require("multer");
const { storage } = require("../../../config/cloudinary");
const upload = multer({ storage });

const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const { error, value } = testimonialValidator.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    const photo_url = req.file?.path || testimonial.photo_url;

    testimonial.set({
      ...value,
      photo_url,
    });

    await testimonial.save();

    return res.status(200).json({
      message: "Testimonial updated successfully.",
      testimonial,
    });
  } catch (error) {
    console.error("Update Testimonial Error:", error);
    return res.status(500).json({ message: "Failed to update testimonial" });
  }
};

module.exports = { updateTestimonial, upload };
