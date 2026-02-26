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

  //login
  const login = async (email, password) => {
  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    // Save token
    localStorage.setItem("token", data.token);

    // Save user
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
    setUser(data.user);

    return data.user;

  } catch (error) {
    throw error;
  }
};

  //register
  const register = async ({ name, email, password, role = "student" }) => {
  try {
    const response = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password, role })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
    setUser(data.user);

    return data.user;

  } catch (error) {
    throw error;
  }
};

const logout = () => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem("token");
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