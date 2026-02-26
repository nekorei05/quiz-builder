import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const STORAGE_KEY = "quiz_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEY);
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  });

  const loading = false;

  const login = async (email, password) => {
    if (!email) {
      throw new Error("Email is required");
    }

    const newUser = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      name: email.split("@")[0],
      email,
      role: email.toLowerCase().includes("admin") ? "admin" : "student",
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    setUser(newUser);

    return newUser;
  };

  const register = async ({ name, email, password, role = "student" }) => {
    if (!name || !email) {
      throw new Error("Name and email are required");
    }

    const newUser = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      name,
      email,
      role: role === "admin" ? "admin" : "student",
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    setUser(newUser);

    return newUser;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}