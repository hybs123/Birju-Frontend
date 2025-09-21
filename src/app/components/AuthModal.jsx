"use client";
import { useState } from "react";

export default function AuthModal({ isOpen, onClose, isSignup, toggleMode }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = isSignup
        ? "https://birjuram-ai.onrender.com/users/create"
        : "https://birjuram-ai.onrender.com/users/login";

      const body = isSignup
        ? { username, email, password }
        : { username, password }; // use username for login

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      console.log(isSignup ? "Signup response:" : "Login response:", data);

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      if (isSignup) {
        // Signup successful → show login
        alert("Signup successful! Please login now.");
        toggleMode(); // switch to login form
        setUsername("");
        setEmail("");
        setPassword("");
      } else {
        // Login → save token
        if (data.token) {
          localStorage.setItem("token", data.token);
          if (data.user) {
            localStorage.setItem("user", JSON.stringify(data.user));
          } else {
            const parseJwt = (token) =>
              JSON.parse(atob(token.split(".")[1]));
            localStorage.setItem("user", JSON.stringify(parseJwt(data.token)));
          }
        }
        alert("Login successful!");
        onClose();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          {isSignup ? "Create an Account" : "Welcome Back"}
        </h2>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 placeholder:text-gray-500" // <-- ADDED CLASSES HERE
            />
          </div>

          {isSignup && (
            <div>
              <label className="block text-gray-700 text-sm mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 placeholder:text-gray-500" // <-- ADDED CLASSES HERE
              />
            </div>
          )}

          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 placeholder:text-gray-500" // <-- ADDED CLASSES HERE
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? "Please wait..." : isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        {/* Toggle */}
        <p className="text-sm text-center text-gray-600 mt-4">
          {isSignup ? (
            <>
              Already have an account?{" "}
              <button
                onClick={toggleMode}
                className="text-blue-600 hover:underline"
              >
                Login
              </button>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <button
                onClick={toggleMode}
                className="text-blue-600 hover:underline"
              >
                Sign Up
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}