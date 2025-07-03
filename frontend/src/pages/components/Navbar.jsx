import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="bg-black flex items-center justify-between px-8 py-4">
      {/* Left side: Logo */}
      <div className="flex items-center">
        <img
          src="/images/logo1.png"
          
          className="h-10 w-auto mr-3"
        />
       
      </div>

      {/* Right side: Login button */}
      <button
        className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300 transition"
        onClick={() => navigate("/login")}
      >
        Login
      </button>
    </nav>
  );
}
