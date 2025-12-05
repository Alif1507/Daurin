import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchProfileApi, loginUser, registerUser } from "../lib/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (token && !user) {
      fetchMe(token);
    }
  }, [token]);

  const fetchMe = async (jwt) => {
    try {
      const data = await fetchProfileApi(jwt);
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    } catch (err) {
      console.error(err);
      logout();
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError("");
    try {
      const data = await loginUser(email, password);
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      return true;
    } catch (err) {
      setError(err.message || "Login gagal");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    setError("");
    try {
      await registerUser(payload);
      return true;
    } catch (err) {
      setError(err.message || "Registrasi gagal");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, error, login, register, logout, fetchMe }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
