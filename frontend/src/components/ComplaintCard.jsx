import { useState } from "react";
import { Pencil, Trash2, X, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { CATEGORIES } from "../utils/complaintsStore";

const statusStyles = {
  Pending:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700",
  "In Progress":
    "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700",
  Resolved:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700",
};

const priorityStyles = {
  High:
    "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700",
  Medium:
    "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700",
  Low:
    "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700",
};

export default function ComplaintCard({
  complaint,
  onStatusChange,
  onEdit,
  onDelete,
}) {
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";
  const isOwner = user?.email === complaint.studentEmail;

  const [isEditing, setIsEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const [form, setForm] = useState({
    title: complaint.title,
    description: complaint.description,
    category: complaint.category,
    priority: complaint.priority || "Medium",
  });

  const formattedDate = new Date(complaint.createdAt).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );

  const handleSave = () => {
    if (!form.title.trim() || !form.description.trim()) return;

    onEdit?.(complaint._id, form);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setForm({
      title: complaint.title,
      description: complaint.description,
      category: complaint.category,
      priority: complaint.priority || "Medium",
    });

    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    if (confirmingDelete) {
      onDelete?.(complaint._id);
    } else {
      setConfirmingDelete(true);
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-indigo-300 dark:border-slate-700 p-5 shadow-sm space-y-3 transition-colors">

        <input
          type="text"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
          placeholder="Title"
          className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <select
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
          className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={form.priority}
          onChange={(e) =>
            setForm({ ...form, priority: e.target.value })
          }
          className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="Low">🟢 Low</option>
          <option value="Medium">🟡 Medium</option>
          <option value="High">🔴 High</option>
        </select>

        <textarea
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          rows={3}
          placeholder="Description"
          className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <div className="flex gap-2 justify-end">
          <button
            onClick={handleCancel}
            className="flex items-center gap-1 text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg px-3 py-1.5 transition-colors"
          >
            <X size={14} />
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg px-3 py-1.5 transition-colors"
          >
            <Check size={14} />
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border p-5 shadow-sm hover:shadow-md transition-all ${
        complaint.priority === "High"
          ? "border-red-300 dark:border-red-700 bg-red-50/30 dark:bg-red-900/20 border-l-4 border-l-red-600"
          : complaint.priority === "Medium"
          ? "border-yellow-300 dark:border-yellow-700 bg-yellow-50/20 dark:bg-yellow-900/20 border-l-4 border-l-yellow-500"
          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-white">
            {complaint.title}
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {complaint.category} • {formattedDate}
            {isAdmin && <> • by {complaint.studentName}</>}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
              priorityStyles[complaint.priority || "Medium"]
            }`}
          >
            {complaint.priority || "Medium"} Priority
          </span>

          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
              statusStyles[complaint.status]
            }`}
          >
            {complaint.status}
          </span>
        </div>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
        {complaint.description}
      </p>

      <div className="mt-5 flex items-center justify-between">
        {isAdmin && onStatusChange ? (
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500 dark:text-slate-400">
              Update status:
            </label>

            <select
              value={complaint.status}
              onChange={(e) =>
                onStatusChange(complaint._id, e.target.value)
              }
              className="text-sm border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        ) : (
          <div />
        )}

        {isOwner && (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-1.5"
            >
              <Pencil size={13} />
              Edit
            </button>

            <button
              onClick={handleDeleteClick}
              onBlur={() => setConfirmingDelete(false)}
              className={`flex items-center gap-1 text-xs font-medium rounded-lg px-3 py-1.5 border ${
                confirmingDelete
                  ? "bg-red-600 text-white border-red-600"
                  : "border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-red-300 hover:text-red-600"
              }`}
            >
              <Trash2 size={13} />
              {confirmingDelete ? "Confirm?" : "Delete"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}