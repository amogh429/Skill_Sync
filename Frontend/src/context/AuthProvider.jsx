// AuthProvider.jsx
import React, { useState } from "react";
import { AuthContext } from "./authContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
  try {
    const storedUser = localStorage.getItem("user");

    if (!storedUser || storedUser === "undefined") return null;

    return JSON.parse(storedUser);
  } catch (error) {
    console.error("Invalid user in localStorage:", error);
    return null;
  }
});


  // ✅ Login → store user + token
  const login = (data) => {
  setUser(data);
  localStorage.setItem("user", JSON.stringify(data)); // ← this line must exist
};

  // ✅ Logout → clear everything
  const logout = () => {
  setUser(null);

  localStorage.removeItem("user");
  localStorage.removeItem("token");
};

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};