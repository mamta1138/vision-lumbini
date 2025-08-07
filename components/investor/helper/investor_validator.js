const Joi = require("joi");

const investorValidation = Joi.object({
  _id: Joi.any().strip(),
  fullName: Joi.string().trim().max(200).required().messages({
    "any.required": "Full name is required",
    "string.empty": "Full name cannot be empty",
    "string.max": "Full name must be less than 200 characters"
  }),

  dateOfBirth: Joi.date().max('now').required().messages({
    "any.required": "Date of birth is required",
    "date.base": "Date of birth must be a valid date in YYYY-MM-DD format",
    "date.max": "Date of birth cannot be in the future"
  }),

  email: Joi.string().email().trim().required().messages({
    "any.required": "Email is required",
    "string.email": "Email must be a valid email address",
    "string.empty": "Email cannot be empty"
  }),

  phoneNumber: Joi.string()
    .trim()
    .pattern(/^\+?[0-9]{10,15}$/)
    .required()
    .messages({
      "any.required": "Phone number is required",
      "string.empty": "Phone number cannot be empty",
      "string.pattern.base": "Phone number must be 10 to 15 digits and may start with '+'"
    }),

  telephoneNumber: Joi.string()
    .pattern(/^[0-9]*$/)
    .allow("", null)
    .min(6)
    .max(15)
    .messages({
      "string.pattern.base": "Telephone number must be numbers only",
      "string.min": "Telephone number must be at least 6 digits",
      "string.max": "Telephone number must not exceed 15 digits"
    }),

  permanentAddress: Joi.object({
    district: Joi.string().max(200).required().messages({
      "any.required": "District is required",
      "string.empty": "District cannot be empty",
      "string.max": "District must be less than 200 characters"
    }),
    wardNo: Joi.number().integer().min(1).required().messages({
      "any.required": "Ward number is required",
      "number.base": "Ward number must be a number",
      "number.min" : "Ward number cannot be less than 1."
    }),
    houseNo: Joi.string().max(100).allow("", null).messages({
      "string.max": "House number must not exceed 100 characters"
    }),
    streetOrTole: Joi.string().max(200).required().messages({
      "any.required": "Street/Tole is required",
      "string.empty": "Street/Tole cannot be empty",
      "string.max": "Street/Tole must be less than 200 characters"
    }),
    municipalityOrRuralMunicipality: Joi.string().max(200).required().messages({
      "any.required": "Municipality or rural municipality is required",
      "string.empty": "Municipality or rural municipality cannot be empty",
      "string.max": "Must be less than 200 characters"
    })
  }).required().messages({
    "object.base": "Permanent address must be an object",
    "any.required": "Permanent address is required"
  }),

  temporaryAddress: Joi.object({
    district: Joi.string().max(200).required().messages({
      "any.required": "District is required",
      "string.empty": "District cannot be empty",
      "string.max": "District must be less than 200 characters"
    }),
    wardNo: Joi.number().integer().min(1).required().messages({
      "any.required": "Ward number is required",
      "number.base": "Ward number must be a number",
      "number.min" : "Ward number cannot be less than 1."
    }),
    houseNo: Joi.string().max(100).allow("", null).messages({
      "string.max": "House number must not exceed 100 characters"
    }),
    streetOrTole: Joi.string().max(200).required().messages({
      "any.required": "Street/Tole is required",
      "string.empty": "Street/Tole cannot be empty",
      "string.max": "Street/Tole must be less than 200 characters"
    }),
    municipalityOrRuralMunicipality: Joi.string().max(200).required().messages({
      "any.required": "Municipality or rural municipality is required",
      "string.empty": "Municipality or rural municipality cannot be empty",
      "string.max": "Must be less than 200 characters"
    })
  }).required().messages({
    "object.base": "Temporary address must be an object",
    "any.required": "Temporary address is required"
  }),

  isSameAsPermanentAddress: Joi.boolean().default(false),

  citizenship: Joi.object({
    number: Joi.string().required().messages({
      "any.required": "Citizenship number is required",
      "string.empty": "Citizenship number cannot be empty"
    }),
    issuedDate: Joi.date().max('now').required().messages({
      "any.required": "Citizenship issued date is required",
      "date.base": "Issued date must be a valid date in YYYY-MM-DD format",
      "date.max": "Issued date cannot be in the future"
    }),
    issuedDistrict: Joi.string().required().messages({
      "any.required": "Citizenship issued district is required",
      "string.empty": "Citizenship issued district cannot be empty"
    })
  }).required(),

  nationalIdNumber: Joi.string().allow("", null).messages({
  }),

  panDetails: Joi.object({
    panNumber: Joi.string().allow("", null),
    dematNumber: Joi.string().required().allow("", null)
  }),

  shareDetails: Joi.object({
    agreedAmount: Joi.number().required().messages({
      "any.required": "Agreed amount is required",
      "number.base": "Agreed amount must be a number"
    }),
    depositedAmount: Joi.number().required().messages({
      "any.required": "Deposited amount is required",
      "number.base": "Deposited amount must be a number"
    }),
    depositedDate: Joi.date().required().messages({
      "any.required": "Deposited date is required",
      "date.base": "Deposited date must be a valid date"
    }),
    source: Joi.string().allow(null,""),
    remarks: Joi.string().max(300).allow("")
  }),

  family: Joi.object({
    spouseName: Joi.string().max(200).allow("", null).messages({
      "string.max": "Spouse name must be less than 200 characters"
    }),
    fatherName: Joi.string().max(200).required().messages({
      "any.required": "Father's name is required",
      "string.empty": "Father's name cannot be empty",
      "string.max": "Mother's name must be less than 200 characters"
    }),
    motherName: Joi.string().max(200).required().messages({
      "any.required": "Mother's name is required",
      "string.empty": "Mother's name cannot be empty",
      "string.max": "Mother's name must be less than 200 characters"
    }),
    grandfatherName: Joi.string().max(200).allow(null, "").messages({
      "string.max": "Grandfather's name must be less than 200 characters"
    }),
    grandmotherName: Joi.string().max(200).allow(null, "").messages({
      "string.max": "Grandmother's name must be less than 200 characters"
    }),
    sonName: Joi.string().max(200).allow(null, "").messages({
      "string.max": "Son's name must be less than 200 characters"
    }),
    daughterName: Joi.string().max(200).allow(null, "").messages({
      "string.max": "Daughter's name must be less than 200 characters"
    }),
    daughterInLaw: Joi.string().max(200).allow(null, "").messages({
      "string.max": "Daughter-in-law's name must be less than 200 characters"
    }),
    fatherInLaw: Joi.string().max(200).allow(null, "").messages({
      "string.max": "Father-in-law's name must be less than 200 characters"
    })
  }),

  jobs: Joi.array().items(
    Joi.object({
      companyName: Joi.string().max(200).allow("", null).messages({
        "string.max": "Company name must be less than 200 characters"
      }),
      address: Joi.string().max(200).allow("", null).messages({
        "string.max": "Job address must be less than 200 characters"
      }),
      position: Joi.string().max(200).allow("", null).messages({
        "string.max": "Job position must be less than 200 characters"
      }),
      remarks: Joi.string().max(200).allow("", null).messages({
        "string.max": "Remarks must be less than 200 characters"
      })
  })),

  documents: Joi.object({
    passportPhoto: Joi.string().required().messages({
      "any.required": "Passport photo is required",
      "string.empty": "Passport photo cannot be empty"
    }),
    verifyingDocuments: Joi.array().items(Joi.string()).min(1).max(5).required().messages({
      "any.required": "At least one verifying document is required",
      "array.min": "Minimum 1 verifying document is required",
      "array.max": "No more than 5 files can be uploaded"
    })
  }).required(),

  status: Joi.string().valid("pending", "approved", "rejected"),

}); 

module.exports = investorValidation;
