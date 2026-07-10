import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardList,
  Clock,
  Loader,
  CheckCircle2,
  AlertTriangle,
  Flag,
  ShieldAlert,
} from "lucide-react";

import StatCard from "../components/StatCard";
import ComplaintCard from "../components/ComplaintCard";
import StatusPieChart from "../components/StatusPieChart";
import PriorityPieChart from "../components/PriorityPieChart";
import MonthlyStatistics from "../components/MonthlyStatistics";

import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";

import {
  getComplaints,
  updateComplaintStatus,
  updateComplaint,
  deleteComplaint,
} from "../utils/api";

export default function Dashboard() {
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  // Status Statistics
  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === "Pending").length;
  const inProgress = complaints.filter(
    (c) => c.status === "In Progress"
  ).length;
  const resolved = complaints.filter(
    (c) => c.status === "Resolved"
  ).length;

  // Priority Statistics
  const highPriority = complaints.filter(
    (c) => c.priority === "High"
  ).length;

  const mediumPriority = complaints.filter(
    (c) => c.priority === "Medium"
  ).length;

  const lowPriority = complaints.filter(
    (c) => c.priority === "Low"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            Welcome back, {user.name.split(" ")[0]} 👋
          </h1>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {user.role === "admin"
              ? "Here's an overview of all campus complaints."
              : "Here's a summary of your complaints."}
          </p>
        </div>

        {user.role === "student" && (
          <Link
            to="/add-complaint"
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            + New Complaint
          </Link>
        )}
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total"
          value={total}
          icon={ClipboardList}
          accent="indigo"
        />

        <StatCard
          label="Pending"
          value={pending}
          icon={Clock}
          accent="amber"
        />

        <StatCard
          label="In Progress"
          value={inProgress}
          icon={Loader}
          accent="rose"
        />

        <StatCard
          label="Resolved"
          value={resolved}
          icon={CheckCircle2}
          accent="emerald"
        />
      </div>

      {/* Priority Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <StatCard
          label="High Priority"
          value={highPriority}
          icon={ShieldAlert}
          accent="rose"
        />

        <StatCard
          label="Medium Priority"
          value={mediumPriority}
          icon={Flag}
          accent="amber"
        />

        <StatCard
          label="Low Priority"
          value={lowPriority}
          icon={AlertTriangle}
          accent="emerald"
        />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <StatusPieChart complaints={complaints} />
        <PriorityPieChart complaints={complaints} />
      </div>

      {/* Monthly Statistics */}
      <MonthlyStatistics complaints={complaints} />

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* Recent Complaints */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-3">
          Recent Complaints
        </h2>

        {loading ? (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-10 text-center text-slate-500 dark:text-slate-400">
            Loading complaints...
          </div>
        ) : complaints.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-10 text-center text-slate-500 dark:text-slate-400">
            No complaints yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {complaints.slice(0, 4).map((complaint) => (
              <ComplaintCard
                key={complaint._id}
                complaint={complaint}
                onStatusChange={handleStatusChange}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
