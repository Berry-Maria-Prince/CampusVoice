// Centralized API client for talking to the CampusVoice backend.
// Set VITE_API_URL in a .env file at the project root if your backend isn't on localhost:5000.

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("ccms_token");
}

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

// ---- Auth ----
export function registerUser({ name, email, password, role }) {
  return request("/auth/register", {
    method: "POST",
    body: { name, email, password, role },
    auth: false,
  });
}

export function loginUser({ email, password }) {
  return request("/auth/login", {
    method: "POST",
    body: { email, password },
    auth: false,
  });
}

export function getMe() {
  return request("/auth/me");
}

// ---- Complaints ----
export function getComplaints() {
  return request("/complaints");
}

export function getComplaintById(id) {
  return request(`/complaints/${id}`);
}

export function addComplaint({ title, description, category, priority }) {
  return request("/complaints", {
    method: "POST",
    body: { title, description, category, priority },
  });
}

export function updateComplaint(id, { title, description, category, priority }) {
  return request(`/complaints/${id}`, {
    method: "PUT",
    body: { title, description, category, priority },
  });
}

export function updateComplaintStatus(id, status) {
  return request(`/complaints/${id}/status`, {
    method: "PATCH",
    body: { status },
  });
}

export function deleteComplaint(id) {
  return request(`/complaints/${id}`, { method: "DELETE" });
}

// ---- Feedback ----
export function addFeedback(message) {
  return request("/feedback", {
    method: "POST",
    body: { message },
  });
}

export function getAllFeedback() {
  return request("/feedback");
}

// ---- Notifications ----
export function getNotifications() {
  return request("/notifications");
}

export function markNotificationRead(id) {
  return request(`/notifications/${id}/read`, { method: "PATCH" });
}

export function markAllNotificationsRead() {
  return request("/notifications/read-all", { method: "PATCH" });
}

export { getToken };
