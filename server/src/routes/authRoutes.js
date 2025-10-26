const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const optionalAuth = require("../middleware/optionalAuth");
const {
  signupValidator,
  loginValidator,
  runValidation,
} = require("../middleware/validate");

// Public login
router.post("/login", loginValidator, runValidation, authController.login);

// Signup: if no users exist, anyone can create first owner. Otherwise owner must be authenticated.
router.post(
  "/signup",
  optionalAuth,
  signupValidator,
  runValidation,
  authController.signup
);

// current user
router.get("/me", authMiddleware, authController.me);

module.exports = router;
