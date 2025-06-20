const Blog = require("../models/blog_model");
const slugify = require("slugify");
const blogValidation = require("../helper/blog_validator");

const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid blog ID" });
    }

    const { error, value } = blogValidation.validate(updates, { allowUnknown: true, stripUnknown: true });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    if (value.title) {
      value.slug = slugify(value.title, { lower: true });
    }

    const uploadedImages = req.files?.image || [];
    if (uploadedImages.length > 0) {
      value.image_url = uploadedImages[0].path;
      value.gallery = uploadedImages.slice(1).map(file => file.path);
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, value, {
      new: true,
      runValidators: true,
    })
      .populate("author", "fullname email")
      .populate("categories", "name slug")
      .populate("tags", "name slug");

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    return res.status(200).json({
      message: "Blog updated successfully",
      blog: updatedBlog,
    });

  } catch (error) {
    console.error("Update Blog Error:", error);
    return res.status(500).json({ message: "Error updating blog" });
  }
};

module.exports = updateBlog;
