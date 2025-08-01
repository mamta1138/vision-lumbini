const Joi = require("joi");

const testimonialValidator = Joi.object({
  full_name: Joi.string()
    .max(100)
    .required()
    .messages({
      "string.empty": "Full name is required",
      "string.max": "Full name must be at most 100 characters",
    }),

  description: Joi.string()
    .max(1000)
    .required()
    .messages({
      "string.empty": "Testimonial message is required",
      "string.max": "Message must be at most 1000 characters"
    }),

  photo_url: Joi.string()
    .uri()
    .allow("")
    .messages({
      "string.uri": "Photo must be a valid URL",
    }),

  status: Joi.string().valid("pending", "approved").default("pending")
});

module.exports = testimonialValidator;
