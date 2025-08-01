const Joi = require("joi");

const reportValidator = Joi.object({
  title: Joi.string()
    .max(100)
    .required()
    .messages({
      "string.empty": "Title is required",
      "string.max": "Title must not exceed 100 characters",
    }),

  description: Joi.string()
    .max(1000)
    .allow("", null)
    .messages({
      "string.max": "Description must not exceed 1000 characters",
    }),

  fiscalYear: Joi.string()
    .pattern(/^\d{4}\/\d{2}$/)
    .allow("", null)
    .messages({
      "string.pattern.base": "Fiscal year must be in format YYYY/YY (e.g., 2024/25)",
    }),

  quarter: Joi.string()
    .valid("Quarter-1", "Quarter-2", "Quarter-3", "Quarter-4", "")
    .messages({
      "any.only": "Quarter must be one of Quarter-1 to Quarter-4",
    }),

  status: Joi.string()
    .valid("pending", "approved")
    .optional(),
});

module.exports = reportValidator;
