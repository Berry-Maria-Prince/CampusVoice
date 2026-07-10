import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getComplaints } from "../utils/api";

export default function Profile() {
  const { user } = useAuth();
  const [complaintCount, setComplaintCount] = useState(null);

  useEffect(() => {
    getComplaints()
      .then((data) => setComplaintCount(data.length))
      .catch(() => setComplaintCount(null));
  }, []);

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">My Profile</h1>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm transition-colors">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xl">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">{user.name}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">{user.role}</p>
          </div>
        </div>

        <dl className="divide-y divide-slate-100 dark:divide-slate-700 text-sm">
          <div className="flex justify-between py-3">
            <dt className="text-slate-500 dark:text-slate-400">Email</dt>
            <dd className="font-medium text-slate-800 dark:text-white">{user.email}</dd>
          </div>
          <div className="flex justify-between py-3">
            <dt className="text-slate-500 dark:text-slate-400">Role</dt>
            <dd className="font-medium text-slate-800 dark:text-white capitalize">{user.role}</dd>
          </div>
          <div className="flex justify-between py-3">
            <dt className="text-slate-500 dark:text-slate-400">
              {user.role === "admin" ? "Total Complaints (campus)" : "Complaints Submitted"}
            </dt>
            <dd className="font-medium text-slate-800 dark:text-white">
              {complaintCount === null ? "—" : complaintCount}
            </dd>
          </div>
        </dl>
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">
        Profile editing isn't available yet — this will connect to a future user-update API.
      </p>
    </div>
  );
}
