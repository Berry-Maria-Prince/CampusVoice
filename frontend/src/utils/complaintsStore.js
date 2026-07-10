// Shared constants used across the app for complaint categories, statuses, and priorities.
// The actual data now lives in MongoDB via the backend — see src/utils/api.js
// for the functions that talk to the real API.

export const CATEGORIES = [
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

export const STATUSES = ["Pending", "In Progress", "Resolved"];

export const PRIORITIES = ["High", "Medium", "Low"];
