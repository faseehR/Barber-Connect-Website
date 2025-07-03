import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar"; // importing our Navbar separately

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Background Section */}
      <div
        className="flex-1 bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: "url('/images/page1.jpg')", // your background image
          marginTop: "64px", // to prevent overlap with fixed navbar if you make navbar fixed
        }}
      >
        {/* Centered Card */}
        <div className="bg-white bg-opacity-90 p-8 rounded shadow-md text-center max-w-md">
          <h1 className="text-lg font-semibold mb-4 text-black">
            Book Smarter, Look Sharper – Your Barber, Your Time!
          </h1>
          <button
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
            onClick={() => navigate("/signup")}
          >
            JOIN NOW
          </button>
        </div>
      </div>
    </div>
  );
}
