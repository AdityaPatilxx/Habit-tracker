// src/components/layout/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext"; // Adjust path as needed
import { Button } from "@/components/ui/button"; // Shadcn UI Button
import { LogOut, NotebookPen } from "lucide-react";

export const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to log out:", error);
      // Handle logout error (e.g., display an alert)
    }
  };

  const isAnonymous = currentUser?.isAnonymous;

  return (
    <nav className="bg-slate-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center max-w-4xl">
        <Link
          to="/dashboard"
          className="text-xl font-bold flex items-center gap-2"
        >
          <NotebookPen size={28} /> Habit Tracker
        </Link>
        <div>
          {!isAnonymous ? (
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-white hover:bg-slate-700 hover:text-white"
            >
              <LogOut size={20} className="mr-2" /> Logout
            </Button>
          ) : (
            <div className="space-x-2">
              <Button
                asChild
                variant="ghost"
                className="text-white hover:bg-slate-700 hover:text-white"
              >
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
