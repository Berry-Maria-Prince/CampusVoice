import { useNavigate } from "react-router-dom";
import { Moon, Sun, Bell, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useState, useEffect, useRef } from "react";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../utils/api";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const loadNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch {
      // silently fail — notifications are non-critical
    }
  };

  useEffect(() => {
    if (user) {
      loadNotifications();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch {
      // silently fail
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
    } catch {
      // silently fail
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 sticky top-0 z-20 transition-colors">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
          CC
        </div>

        <span className="font-semibold text-slate-800 dark:text-white hidden sm:block">
          CampusVoice
        </span>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">

        {/* Notification Bell */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => {
              setOpen(!open);
              if (!open) loadNotifications();
            }}
            className="w-10 h-10 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition relative"
          >
            <Bell size={20} className="text-slate-700 dark:text-slate-300" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 max-h-96 flex flex-col">
              <div className="p-3 font-semibold border-b dark:border-slate-700 flex items-center justify-between text-slate-800 dark:text-white">
                <span>🔔 Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="overflow-y-auto flex-1">
                {notifications.length === 0 ? (
                  <div className="p-4 text-sm text-slate-500 dark:text-slate-400 text-center">
                    No notifications yet.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      className={`px-4 py-3 border-b border-slate-100 dark:border-slate-700 text-sm flex items-start gap-2 ${
                        n.read
                          ? "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                          : "bg-indigo-50 dark:bg-indigo-900/20 text-slate-700 dark:text-slate-200"
                      }`}
                    >
                      <div className="flex-1">
                        <p>{n.message}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                          {new Date(n.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      {!n.read && (
                        <button
                          onClick={() => handleMarkRead(n._id)}
                          className="text-indigo-500 hover:text-indigo-700 dark:text-indigo-400 mt-0.5 shrink-0"
                          title="Mark as read"
                        >
                          <Check size={16} />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          {darkMode ? (
            <Sun size={20} className="text-yellow-400" />
          ) : (
            <Moon size={20} className="text-slate-700" />
          )}
        </button>

        {/* User Info */}
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-slate-800 dark:text-white">
            {user?.name}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
            {user?.role}
          </p>
        </div>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-white flex items-center justify-center font-semibold text-sm">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-red-600 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-1.5 transition-colors"
        >
          Logout
        </button>

      </div>
    </header>
  );
}
