import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="bg-black flex items-center justify-between px-6 h-12 fixed w-full top-0 z-50">
      {/* Logo */}
      <img
        src="/images/logo1.png"
        className="h-6 w-auto"
      />

      {/* Login Button */}
      <button
        className="bg-white text-black text-sm px-3 py-1 rounded hover:bg-gray-300 transition"
        onClick={() => navigate("/login")}
      >
        Login
      </button>
    </nav>
  );
}
