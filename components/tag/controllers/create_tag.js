const Tag = require("../models/tag_model");
const tagValidator = require("../helper/tag_validator");

const generateNepaliSlug = (text) => {
  return text
    .trim()
    .replace(/[।.,/#!$%^&*;:{}=_~()]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase();
};

const createTag = async (req, res) => {
  try {
    const { error, value } = tagValidator.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name } = value;

    const existingTag = await Tag.findOne({ name });
    if (existingTag) {
      return res.status(400).json({ message: "Tag already exists" });
    }

    let generatedSlug = generateNepaliSlug(name);
    if (!generatedSlug) {
      generatedSlug = `tag-${Date.now()}`;
    }

    const newTag = new Tag({
      name,
      slug: generatedSlug,
    });

    await newTag.save();

    return res.status(201).json({
      message: "Tag created successfully",
      tag: newTag,
    });
  } catch (error) {
    console.error("Create Tag Error:", error);
    return res.status(500).json({ message: "Failed to create tag" });
  }
};

module.exports = createTag;
