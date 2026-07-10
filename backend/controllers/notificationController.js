const asyncHandler = require("express-async-handler");
const Notification = require("../models/Notification");

// @desc    Get notifications for the logged-in user
// @route   GET /api/notifications
// @access  Private
const getUserNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);

  res.json(notifications);
});

// @desc    Mark a single notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }

  // Only the owner can mark their notification as read
  if (notification.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Forbidden: not your notification");
  }

  notification.read = true;
  await notification.save();

  res.json(notification);
});

// @desc    Mark all notifications as read for the logged-in user
// @route   PATCH /api/notifications/read-all
// @access  Private
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { user: req.user._id, read: false },
    { $set: { read: true } }
  );

  res.json({ message: "All notifications marked as read" });
});

module.exports = { getUserNotifications, markAsRead, markAllAsRead };
