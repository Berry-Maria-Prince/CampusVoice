const mongoose = require("mongoose");

const CATEGORIES = [
  "Classroom",
  "Laboratory",
  "Hostel",
  "Library",
  "Internet/Wi-Fi",
  "Electrical",
  "Water Supply",
  "Cleanliness",
  "Other",
];

const STATUSES = ["Pending", "In Progress", "Resolved"];

const PRIORITIES = ["High", "Medium", "Low"];

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: CATEGORIES,
      required: [true, "Category is required"],
    },
    priority: {
      type: String,
      enum: PRIORITIES,
      default: "Medium",
    },
    status: {
      type: String,
      enum: STATUSES,
      default: "Pending",
    },
    // Reference to the student who filed it
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Denormalized fields kept in sync with the User, so the frontend
    // (which expects studentEmail / studentName directly on the complaint)
    // doesn't need extra populate/joins.
    studentEmail: {
      type: String,
      required: true,
    },
    studentName: {
      type: String,
      required: true,
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

module.exports = mongoose.model("Complaint", complaintSchema);
module.exports.CATEGORIES = CATEGORIES;
module.exports.STATUSES = STATUSES;
module.exports.PRIORITIES = PRIORITIES;
