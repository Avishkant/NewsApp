const { check, validationResult } = require("express-validator");

const signupValidator = [
  check("name").trim().notEmpty().withMessage("Name is required"),
  check("email").isEmail().withMessage("Valid email is required"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const loginValidator = [
  check("email").isEmail().withMessage("Valid email is required"),
  check("password").notEmpty().withMessage("Password is required"),
];

const createNewsValidator = [
  check("title").trim().notEmpty().withMessage("Title is required"),
  check("content").trim().notEmpty().withMessage("Content is required"),
  check("district").isMongoId().withMessage("District must be a valid id"),
  check("link")
    .optional()
    .isURL({ require_protocol: true })
    .withMessage("Link must be a valid URL (include http:// or https://)"),
];

const updateNewsValidator = [
  check("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty"),
  check("content")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Content cannot be empty"),
  check("district")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("District cannot be empty"),
  check("link")
    .optional()
    .isURL({ require_protocol: true })
    .withMessage("Link must be a valid URL (include http:// or https://)"),
];

function runValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

module.exports = {
  signupValidator,
  loginValidator,
  createNewsValidator,
  updateNewsValidator,
  runValidation,
};
