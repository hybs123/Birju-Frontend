"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import AuthModal from "./components/AuthModal";
import ProfileDropdown from "./components/ProfileDropdown";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [hasRoadmap, setHasRoadmap] = useState(false);
  const [hasCounselling, setHasCounselling] = useState(false);

  // 🔹 Check localStorage for token & user on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setIsAuthenticated(true);
      setUser(parsedUser);

      // Fetch roadmap + counselling info for the user
      fetchUserRoadmap(parsedUser.username);
      fetchUserCounselling(parsedUser.username);
    }
  }, []);

  // 🔹 Fetch user's roadmap
  const fetchUserRoadmap = async (username) => {
    try {
      const res = await fetch("https://birjuram-ai.onrender.com/roadmap", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      const data = await res.json();
      console.log("Roadmap API response:", data);

      setHasRoadmap(!!data.roadmap); // true if roadmap exists
    } catch (err) {
      console.error("Error fetching roadmap:", err);
    }
  };

  // 🔹 Fetch user's counselling
  const fetchUserCounselling = async (username) => {
    try {
      const res = await fetch("https://birjuram-ai.onrender.com/career", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      const data = await res.json();
      console.log("Counselling API response:", data);

      setHasCounselling(!!data.counseling_report); // true if counselling exists
    } catch (err) {
      console.error("Error fetching counselling:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    setHasRoadmap(false);
    setHasCounselling(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center px-8 py-6 z-50">
        <Link href="/" className="text-2xl font-extrabold text-blue-600">
          Birjuram.Ai
        </Link>

        {isAuthenticated && user ? (
          <ProfileDropdown user={user} onLogout={handleLogout} />
        ) : (
          <div className="space-x-4">
            <button
              onClick={() => {
                setIsSignup(false);
                setIsOpen(true);
              }}
              className="text-gray-700 hover:text-blue-600 transition font-medium"
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsSignup(true);
                setIsOpen(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-medium transition"
            >
              Sign Up
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="flex flex-col items-center justify-center text-center px-6 mt-12">
        <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mt-20 mb-4">
          Welcome to <span className="text-blue-600">Birjuram.Ai</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mb-8">
          Your AI-powered career companion — get personalized guidance, generate
          roadmaps, and stay consistent with streaks.
        </p>
        <button
          onClick={() => {
            setIsSignup(true);
            setIsOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition"
        >
          Get Started
        </button>
      </header>

      {/* Features Section */}
      <main className="flex flex-col items-center justify-center flex-1 px-6 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          {/* Career Counsellor */}
          <div className="p-8 bg-white/70 backdrop-blur-md rounded-2xl shadow-md hover:shadow-lg transition flex flex-col items-center">
            <Image
              src="/icons/counsellor.png"
              alt="Career Counsellor"
              width={150}
              height={150}
              className="mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800 text-center">
              Career Counsellor
            </h3>
            <p className="text-gray-600 mt-2 text-center">
              Get personalized advice on choosing and growing in your career.
            </p>
            <Link href="/counsellor" className="w-full">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition mt-auto w-full">
                {hasCounselling ? "View Counselling" : "Get Started"}
              </button>
            </Link>
          </div>

          {/* Roadmap */}
          <div className="p-8 bg-white/70 backdrop-blur-md rounded-2xl shadow-md hover:shadow-lg transition flex flex-col items-center">
            <Image
              src="/icons/roadmap.png"
              alt="Generate Roadmap"
              width={150}
              height={150}
              className="mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800">
              Generate Roadmap
            </h3>
            <p className="text-gray-600 mt-2 text-center">
              AI-generated step-by-step roadmap tailored to your goals.
            </p>
            <Link href="/roadmap" className="w-full">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition mt-auto w-full">
                {hasRoadmap ? "View Roadmap" : "Get Started"}{" "}
              </button>
            </Link>
          </div>

          {/* Quiz Feature */}
          <div className="p-8 bg-white/70 backdrop-blur-md rounded-2xl shadow-md hover:shadow-lg transition flex flex-col items-center">
            <Image
              src="/icons/streak.png"
              alt="Quiz"
              width={150}
              height={150}
              className="mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800">Quiz</h3>
            <p className="text-gray-600 mt-2 text-center">
              Test your knowledge with weekly quizzes and track your
              improvement.
            </p>

            {/* Link to quiz route */}
            <Link href="/quiz" className="w-full">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition mt-auto w-full">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-6 text-gray-600 mt-12">
        © {new Date().getFullYear()} Birjuram.Ai — All rights reserved.
      </footer>

      <AuthModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          const token = localStorage.getItem("token");
          const storedUser = localStorage.getItem("user");
          if (token && storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setIsAuthenticated(true);
            setUser(parsedUser);

            // Refresh roadmap + counselling status after login
            fetchUserRoadmap(parsedUser.username);
            fetchUserCounselling(parsedUser.username);
          }
        }}
        isSignup={isSignup}
        toggleMode={() => setIsSignup(!isSignup)}
      />
    </div>
  );
}
