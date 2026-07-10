import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  PlusCircle,
  History,
  UserCircle,
  Info,
  CircleHelp,
  MessageCircle,
} from "lucide-react";

const linkBase =
  "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors";

const linkInactive =
  "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white";

const linkActive =
  "bg-indigo-600 text-white shadow-sm";

export default function Sidebar() {
  const { user } = useAuth();

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ...(user?.role === "student"
      ? [{ to: "/add-complaint", label: "New Complaint", icon: PlusCircle }]
      : []),
    { to: "/history", label: "History", icon: History },
    { to: "/profile", label: "Profile", icon: UserCircle },
    { to: "/about", label: "About", icon: Info },
    ...(user?.role === "student"
      ? [{ to: "/faq", label: "FAQ", icon: CircleHelp }]
      : []),
    { to: "/feedback", label: "Feedback", icon: MessageCircle },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 h-full hidden md:flex flex-col py-6 px-3 shrink-0 transition-colors">
      <nav className="flex flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs text-slate-500 dark:text-slate-400 transition-colors">
        Logged in as{" "}
        <span className="font-medium text-slate-700 dark:text-white capitalize">
          {user?.role}
        </span>
      </div>
    </aside>
  );
}