import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div className="w-full border-b bg-white">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* 🔹 Logo */}
        <h1
          className="text-xl font-bold cursor-pointer"
          onClick={() => navigate("/matches")}
        >
          SkillSync
        </h1>

        {/* 🔹 Links */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/matches")}
            className="text-sm font-medium"
          >
            Matches
          </button>

          <button
            onClick={() => navigate("/connections")}
            className="text-sm font-medium"
          >
            Connections
          </button>

          {/* 🔹 Logout */}
          <Button
            variant="outline"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;