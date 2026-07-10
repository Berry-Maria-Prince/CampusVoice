import { ThemeProvider } from "./context/ThemeContext";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import {
  NotificationProvider,
} from "./context/NotificationContext";
import Notification from "./components/Notification";

import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddComplaint from "./pages/AddComplaint";
import History from "./pages/History";
import Profile from "./pages/Profile";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Feedback from "./pages/Feedback";

function StudentRoute({ children }) {
  const { user } = useAuth();

  if (user?.role !== "student") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <>
      <Notification />

      <Routes>
        <Route
          path="/login"
          element={
            user ? <Navigate to="/dashboard" replace /> : <Login />
          }
        />

        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route
            path="/add-complaint"
            element={
              <StudentRoute>
                <AddComplaint />
              </StudentRoute>
            }
          />

          <Route path="/history" element={<History />} />

          <Route path="/profile" element={<Profile />} />

          <Route path="/about" element={<About />} />

          <Route path="/faq" element={<FAQ />} />

          <Route path="/feedback" element={<Feedback />} />

        </Route>

        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <AppRoutes />
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
