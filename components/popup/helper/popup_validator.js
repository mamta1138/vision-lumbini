const Joi = require("joi");

const popupValidation = Joi.object({
  title: Joi.string().max(100).allow(null, "").messages({
    "string.max": "Title must not exceed 100 characters",
  }),
  status: Joi.string().valid("pending", "approved", "draft").default("draft").messages({
    "string.valid": "Status must be either 'pending' or 'approved'",
  }),
});

module.exports = popupValidation;
