import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import ComplaintCard from "../components/ComplaintCard";
import {
  getComplaints,
  updateComplaintStatus,
  updateComplaint,
  deleteComplaint,
} from "../utils/api";
import { CATEGORIES, STATUSES } from "../utils/complaintsStore";

const PRIORITIES = ["High", "Medium", "Low"];

export default function History() {
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const loadComplaints = async () => {
    try {
      setError("");
      const data = await getComplaints();
      setComplaints(data);
    } catch (err) {
      setError(err.message || "Failed to load complaints.");
      showNotification(
        err.message || "Failed to load complaints.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateComplaintStatus(id, status);

      showNotification(
        "Complaint status updated successfully!",
        "success"
      );

      loadComplaints();
    } catch (err) {
      setError(err.message || "Failed to update status.");

      showNotification(
        err.message || "Failed to update status.",
        "error"
      );
    }
  };

  const handleEdit = async (id, updatedFields) => {
    try {
      await updateComplaint(id, updatedFields);

      showNotification(
        "Complaint updated successfully!",
        "success"
      );

      loadComplaints();
    } catch (err) {
      setError(err.message || "Failed to update complaint.");

      showNotification(
        err.message || "Failed to update complaint.",
        "error"
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteComplaint(id);

      showNotification(
        "Complaint deleted successfully!",
        "success"
      );

      loadComplaints();
    } catch (err) {
      setError(err.message || "Failed to delete complaint.");

      showNotification(
        err.message || "Failed to delete complaint.",
        "error"
      );
    }
  };

  const filtered = complaints.filter((c) => {
    const statusMatch =
      statusFilter === "All" || c.status === statusFilter;

    const categoryMatch =
      categoryFilter === "All" || c.category === categoryFilter;

    const priorityMatch =
      priorityFilter === "All" || c.priority === priorityFilter;

    return statusMatch && categoryMatch && priorityMatch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Complaint History
        </h1>

        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {user.role === "admin"
            ? "All complaints submitted across campus."
            : "All complaints you've submitted."}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-sm border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="All">All Statuses</option>

          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="text-sm border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="All">All Categories</option>

          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="text-sm border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="All">All Priorities</option>

          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-10 text-center text-slate-500 dark:text-slate-400">
          Loading complaints...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-10 text-center text-slate-500 dark:text-slate-400">
          No complaints match your filters.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((c) => (
            <ComplaintCard
              key={c._id}
              complaint={c}
              onStatusChange={handleStatusChange}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
