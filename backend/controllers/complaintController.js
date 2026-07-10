const asyncHandler = require("express-async-handler");
const Complaint = require("../models/Complaint");
const Notification = require("../models/Notification");
const User = require("../models/User");
const transporter = require("../utils/mailer");

// @desc    Get complaints — students see only their own, admins see all
// @route   GET /api/complaints
// @access  Private
const getComplaints = asyncHandler(async (req, res) => {
  let complaints;

  if (req.user.role === "admin") {
    complaints = await Complaint.find().sort({ createdAt: -1 });
  } else {
    complaints = await Complaint.find({ student: req.user._id }).sort({
      createdAt: -1,
    });
  }

  res.json(complaints);
});

// @desc    Get a single complaint by ID
// @route   GET /api/complaints/:id
// @access  Private
const getComplaintById = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found");
  }

  if (
    req.user.role !== "admin" &&
    complaint.student.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error("Forbidden: this is not your complaint");
  }

  res.json(complaint);
});

// @desc    Create a new complaint (students only)
// @route   POST /api/complaints
// @access  Private (student)
const createComplaint = asyncHandler(async (req, res) => {
  const { title, description, category, priority } = req.body;

  if (!title || !description || !category) {
    res.status(400);
    throw new Error("Please provide title, description and category");
  }

  const complaint = await Complaint.create({
    title,
    description,
    category,
    priority: priority || "Medium",
    status: "Pending",
    student: req.user._id,
    studentEmail: req.user.email,
    studentName: req.user.name,
  });

  // Create in-app notification for all admins
  try {
    const admins = await User.find({ role: "admin" });
    const notificationPromises = admins.map((admin) =>
      Notification.create({
        user: admin._id,
        message: `New complaint submitted by ${req.user.name}: "${title}"`,
        type: "new_complaint",
        complaintId: complaint._id,
      })
    );
    await Promise.all(notificationPromises);
  } catch (err) {
    console.error("Failed to create admin notifications:", err.message);
  }

  res.status(201).json(complaint);
});

// @desc    Update complaint details (student only)
// @route   PUT /api/complaints/:id
// @access  Private
const updateComplaint = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found");
  }

  const isOwner =
    complaint.student.toString() === req.user._id.toString();

  if (req.user.role !== "admin" && !isOwner) {
    res.status(403);
    throw new Error("Forbidden: you can only edit your own complaint");
  }

  const { title, description, category, priority } = req.body;

  if (title !== undefined) complaint.title = title;
  if (description !== undefined) complaint.description = description;
  if (category !== undefined) complaint.category = category;
  if (priority !== undefined) complaint.priority = priority;

  const updated = await complaint.save();

  res.json(updated);
});

// @desc    Update complaint status (admin only)
// @route   PATCH /api/complaints/:id/status
// @access  Private
const updateComplaintStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const validStatuses = ["Pending", "In Progress", "Resolved"];

  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error(
      `Status must be one of: ${validStatuses.join(", ")}`
    );
  }

  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found");
  }

  complaint.status = status;

  const updated = await complaint.save();

  // When resolved: send email + create in-app notification for the student
  if (status === "Resolved") {
    // Send email notification
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: complaint.studentEmail,
        subject: "Complaint Resolved ✅",
        html: `
          <h2>Hello ${complaint.studentName},</h2>

          <p>Your complaint has been successfully resolved.</p>

          <p><strong>Complaint:</strong> ${complaint.title}</p>

          <p><strong>Status:</strong> ${status}</p>

          <br>

          <p>Thank you for using CampusVoice.</p>
        `,
      });
    } catch (err) {
      console.error("Email failed:", err.message);
    }

    // Create in-app notification for the student
    try {
      await Notification.create({
        user: complaint.student,
        message: `Your complaint "${complaint.title}" has been resolved.`,
        type: "complaint_resolved",
        complaintId: complaint._id,
      });
    } catch (err) {
      console.error("Failed to create student notification:", err.message);
    }
  }

  res.json(updated);
});

// @desc    Delete complaint
// @route   DELETE /api/complaints/:id
// @access  Private
const deleteComplaint = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found");
  }

  const isOwner =
    complaint.student.toString() === req.user._id.toString();

  if (req.user.role !== "admin" && !isOwner) {
    res.status(403);
    throw new Error("Forbidden: you can only delete your own complaint");
  }

  await complaint.deleteOne();

  res.json({
    message: "Complaint deleted",
    id: req.params.id,
  });
});

module.exports = {
  getComplaints,
  getComplaintById,
  createComplaint,
  updateComplaint,
  updateComplaintStatus,
  deleteComplaint,
};