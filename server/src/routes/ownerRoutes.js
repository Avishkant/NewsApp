const express = require("express");
const router = express.Router();
const ownerController = require("../controllers/ownerController");
const authMiddleware = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

// All owner routes require authentication and owner role
router.use(authMiddleware, requireRole("owner"));

router.get("/", ownerController.listReporters);
router.delete("/:id", ownerController.deleteReporter);
router.put("/:id", ownerController.editReporter);

module.exports = router;
