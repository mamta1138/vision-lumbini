const Joi = require("joi");

const partnerValidation = Joi.object({
  name: Joi.string().trim().max(100).allow(null, "").optional(),
  status: Joi.string().valid("pending", "approved").optional()
});

module.exports = partnerValidation;
