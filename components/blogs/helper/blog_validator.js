const Joi = require("joi");

const blogValidation = Joi.object({
  title: Joi.string().max(150).required().messages({
    "string.empty": "Title is required",
    "string.max": "Title must not exceed 150 characters"
  }),
  content: Joi.string().required().messages({
    "string.empty": "Content is required",
  }),
  categories: Joi.string().required().messages({
    "any.required": "At least one category is required"
  }),
  tags: Joi.array().items(Joi.string()).required().messages({
    "any.required": "At least one tag is required"
  }),
  is_featured: Joi.boolean().required(),
  status: Joi.string().required().default("published")
});
module.exports = blogValidation;
