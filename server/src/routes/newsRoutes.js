const express = require("express");
const router = express.Router();
const newsController = require("../controllers/newsController");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createNewsValidator,
  updateNewsValidator,
  runValidation,
} = require("../middleware/validate");

// Create news (reporter or owner)
router.post(
  "/",
  authMiddleware,
  createNewsValidator,
  runValidation,
  newsController.createNews
);

// Get all news (public)
router.get("/", newsController.getAllNews);

// Get one news and increment views
router.get("/:id", newsController.getNewsById);

// Update news
router.put(
  "/:id",
  authMiddleware,
  updateNewsValidator,
  runValidation,
  newsController.updateNews
);

// Delete news
router.delete("/:id", authMiddleware, newsController.deleteNews);

module.exports = router;
