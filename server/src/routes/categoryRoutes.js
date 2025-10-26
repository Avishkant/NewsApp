const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const authMiddleware = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

// Public: list categories
router.get("/", categoryController.listCategories);

// Owner-only: create/edit/delete
router.post(
  "/",
  authMiddleware,
  requireRole("owner"),
  categoryController.createCategory
);
router.put(
  "/:id",
  authMiddleware,
  requireRole("owner"),
  categoryController.editCategory
);
router.delete(
  "/:id",
  authMiddleware,
  requireRole("owner"),
  categoryController.deleteCategory
);

module.exports = router;
