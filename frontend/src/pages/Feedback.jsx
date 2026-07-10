import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { addFeedback, getAllFeedback } from "../utils/api";

export default function Feedback() {
  const { user } = useAuth();
  const { showNotification } = useNotification();

  if (user?.role === "admin") {
    return <AdminFeedbackView />;
  }

  return <StudentFeedbackForm />;
}

// ---- Admin: View all student feedback ----
function AdminFeedbackView() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadFeedback = async () => {
      try {
        const data = await getAllFeedback();
        setFeedbackList(data);
      } catch (err) {
        setError(err.message || "Failed to load feedback.");
      } finally {
        setLoading(false);
      }
    };
    loadFeedback();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Student Feedback
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          All feedback submitted by students.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-10 text-center text-slate-500 dark:text-slate-400">
          Loading feedback...
        </div>
      ) : feedbackList.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-10 text-center text-slate-500 dark:text-slate-400">
          No feedback submitted yet.
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                  <th className="text-left px-5 py-3 font-semibold text-slate-700 dark:text-slate-300">
                    Student Name
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-700 dark:text-slate-300">
                    Email
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-700 dark:text-slate-300">
                    Feedback
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-700 dark:text-slate-300">
                    Date & Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {feedbackList.map((fb) => (
                  <tr
                    key={fb._id}
                    className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="px-5 py-3 text-slate-800 dark:text-white font-medium">
                      {fb.user?.name || "Unknown"}
                    </td>
                    <td className="px-5 py-3 text-slate-600 dark:text-slate-400">
                      {fb.user?.email || "N/A"}
                    </td>
                    <td className="px-5 py-3 text-slate-600 dark:text-slate-300 max-w-xs">
                      <p className="line-clamp-3">{fb.message}</p>
                    </td>
                    <td className="px-5 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {new Date(fb.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      {new Date(fb.createdAt).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Student: Submit feedback form ----
function StudentFeedbackForm() {
  const { showNotification } = useNotification();
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!feedback.trim()) {
      showNotification("Please enter your feedback.", "error");
      return;
    }

    setSubmitting(true);

    try {
      await addFeedback(feedback);

      setSubmitted(true);
      setFeedback("");
      showNotification("Feedback submitted successfully!", "success");

      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    } catch (err) {
      showNotification(
        err.message || "Failed to submit feedback.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
        Feedback
      </h1>

      <p className="text-slate-600 dark:text-slate-400">
        We value your feedback. Please let us know how we can improve.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm transition-colors"
      >
        <textarea
          className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows={5}
          placeholder="Your feedback..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />

        <div className="mt-4 flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 transition-colors"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>

        {submitted && (
          <p className="mt-3 text-emerald-600 dark:text-emerald-400 text-sm">
            Thank you for your feedback!
          </p>
        )}
      </form>
    </div>
  );
}