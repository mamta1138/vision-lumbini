const Subscriber = require("../models/subscriber_model");
const Joi = require("joi");

const statusOnlyValidation = Joi.object({
  status: Joi.string()
    .valid("read", "unread", "pending")
    .required()
    .messages({
      "any.only": "Status must be one of: read, unread, or pending",
      "string.empty": "Status is required",
    }),
});

const updateSubscriber = async (req, res) => {
  try {
    const subscriberId = req.params.id;

    const { error, value } = statusOnlyValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const updatedSubscriber = await Subscriber.findByIdAndUpdate(
      subscriberId,
      { status: value.status },
      { new: true }
    ).lean();

    if (!updatedSubscriber) {
      return res.status(404).json({ message: "Subscriber not found" });
    }

    return res.status(200).json({
      message: "Subscriber status updated successfully",
      subscriber: updatedSubscriber,
    });
  } catch (error) {
    console.error("Error updating subscriber status:", error);
    return res.status(500).json({ message: "Failed to update subscriber status" });
  }
};

module.exports = updateSubscriber;
