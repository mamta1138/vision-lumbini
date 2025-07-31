const Category = require("../models/category_model");
const categoryValidation = require("../helper/category_validator");

const generateNepaliSlug = (text) => {
  return text
    .trim()
    .replace(/[।.,/#!$%^&*;:{}=_~()]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase();
};

const createCategory = async (req, res) => {
  try {
    const { error, value } = categoryValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const existing = await Category.findOne({ name: value.name });
    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }

    let slug = generateNepaliSlug(value.name);
    if (!slug) {
      slug = `category-${Date.now()}`;
    }

    const categoryData = {
      name: value.name,
      slug,
      parent: value.parent || null,
    };

    const newCategory = new Category(categoryData);
    await newCategory.save();

    return res.status(201).json({
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    console.error("Create Category Error:", error);
    return res.status(500).json({ message: "Server error while creating category" });
  }
};

module.exports = createCategory;
