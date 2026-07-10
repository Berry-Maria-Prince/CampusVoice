import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser, getMe } from "../utils/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On load, if a token exists, verify it against the backend and restore the session
  useEffect(() => {
    const token = localStorage.getItem("ccms_token");
    if (!token) {
      setLoading(false);
      return;
    }

    getMe()
      .then((data) => setUser(data))
      .catch(() => {
        // token invalid/expired
        localStorage.removeItem("ccms_token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // Real login — calls the backend, stores the JWT, sets the user
  const login = async ({ email, password }) => {
    const data = await loginUser({ email, password });
    localStorage.setItem("ccms_token", data.token);
    const userData = { _id: data._id, name: data.name, email: data.email, role: data.role };
    setUser(userData);
    return userData;
  };

  // Real registration — creates the account, then logs in automatically
  const register = async ({ name, email, password, role }) => {
    const data = await registerUser({ name, email, password, role });
    localStorage.setItem("ccms_token", data.token);
    const userData = { _id: data._id, name: data.name, email: data.email, role: data.role };
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem("ccms_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
