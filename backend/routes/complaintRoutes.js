const express = require("express");
const router = express.Router();
const {
  getComplaints,
  getComplaintById,
  createComplaint,
  updateComplaint,
  updateComplaintStatus,
  deleteComplaint,
} = require("../controllers/complaintController");
const { protect, authorize } = require("../middleware/authMiddleware");

// All complaint routes require a logged-in user
router.use(protect);

router.route("/")
  .get(getComplaints)
  .post(authorize("student"), createComplaint);

router.route("/:id")
  .get(getComplaintById)
  .put(updateComplaint)      // ownership checked inside controller
  .delete(deleteComplaint);  // ownership or admin checked inside controller

// Admin-only: change status
router.patch("/:id/status", authorize("admin"), updateComplaintStatus);

module.exports = router;
