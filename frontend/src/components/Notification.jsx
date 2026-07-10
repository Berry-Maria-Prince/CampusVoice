import { useNotification } from "../context/NotificationContext";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function Notification() {
  const { notification } = useNotification();

  if (!notification) return null;

  return (
    <div className="fixed top-5 right-5 z-50">
      <div
        className={`flex items-center gap-3 px-5 py-3 rounded-lg shadow-lg text-white ${
          notification.type === "success"
            ? "bg-emerald-600"
            : "bg-red-600"
        }`}
      >
        {notification.type === "success" ? (
          <CheckCircle size={20} />
        ) : (
          <AlertCircle size={20} />
        )}

        <span>{notification.message}</span>
      </div>
    </div>
  );
}