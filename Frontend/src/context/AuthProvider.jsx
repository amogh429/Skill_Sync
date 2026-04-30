import {  useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./authContext";



export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser || storedUser === "undefined") return null;

  try {
    return JSON.parse(storedUser);
  } catch {
    return null;
  }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  const login = (userData, token) => {
    setUser(userData);
    setToken(token);

    if(user) {
    localStorage.setItem("user", JSON.stringify(userData));
    }

    if(token) {
         localStorage.setItem("token", token);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    navigate("/login");
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

