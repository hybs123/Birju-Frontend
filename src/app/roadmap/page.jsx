"use client";
import { useEffect, useState } from "react";

// 🔹 Typing animation component
function TypingText({ text, speed = 30 }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed((prev) => prev + text[i]);
      i++;
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return <p className="text-gray-600 leading-relaxed">{displayed}</p>;
}

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("https://birjuram-ai.onrender.com/roadmap", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        console.log("Roadmap response:", data);

        // ✅ Always set the full roadmap object
        setRoadmap(data.roadmap || null);
      } catch (err) {
        console.error("Error fetching roadmap:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setLoading(true);

    const formData = new FormData(e.target);
    const payload = {
      role: formData.get("role"),
      level: formData.get("level"),
      skill: formData.get("skill"),
      duration: formData.get("duration"),
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "https://birjuram-ai.onrender.com/roadmap/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      console.log("Generated roadmap:", data);

      setRoadmap(data.roadmap || null);
    } catch (err) {
      console.error("Error generating roadmap:", err);
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  if (loading && !roadmap) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <p className="text-lg text-gray-600 animate-pulse">
          {submitting ? "Generating your roadmap..." : "Loading roadmap..."}
        </p>
      </div>
    );
  }

  if (!roadmap) {
    // 🚀 Show roadmap generator form if none exists
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-md w-full max-w-lg space-y-6"
        >
          <h2 className="text-2xl font-bold text-blue-600 text-center">
            Generate Your Roadmap
          </h2>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Role</label>
            <input
              name="role"
              required
              placeholder="e.g., Frontend Developer"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Level
            </label>
            <select
              name="level"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
            >
              <option value="">Select level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Skills
            </label>
            <input
              name="skill"
              required
              placeholder="e.g., HTML, CSS, JavaScript"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Duration (weeks)
            </label>
            <input
              name="duration"
              type="number"
              required
              placeholder="e.g., 12"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 placeholder-gray-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold shadow-md transition"
          >
            Generate Roadmap
          </button>
        </form>
      </div>
    );
  }

  // ✅ Show roadmap if available
  console.log("Rendering roadmap:", roadmap);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-6 py-12 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold text-blue-600 mb-8 text-center">
        Your Roadmap for {roadmap.role}
      </h1>

      {/* Typing Intro */}
      <div className="bg-white/70 text-gray-800 backdrop-blur-md rounded-2xl shadow-md p-6 max-w-3xl w-full mb-8">
        {`This is your personalized roadmap for becoming a ${roadmap.role}. It is designed for a ${roadmap.level} level and spans ${roadmap.duration} weeks.`}
      </div>

      {/* Stages */}
      {roadmap.roadmap?.stages && (
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-md p-6 max-w-4xl w-full mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Learning Stages
          </h2>
          <div className="space-y-6">
            {roadmap.roadmap.stages.map((stage, idx) => (
              <div
                key={idx}
                className="border-l-4 border-blue-600 pl-4 bg-white/60 rounded-lg p-4 shadow-sm"
              >
                <h3 className="text-xl font-semibold text-blue-600 mb-2">
                  {stage.stage}
                </h3>
                <p className="font-medium text-gray-800">Skills:</p>
                <ul className="list-disc list-inside text-gray-700 mb-2">
                  {stage.skills.map((skill, i) => (
                    <li key={i}>{skill}</li>
                  ))}
                </ul>
                <p className="font-medium text-gray-800">Actions:</p>
                <ul className="list-disc list-inside text-gray-700">
                  {stage.actions.map((action, i) => (
                    <li key={i}>{action}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weekly Plan */}
      {roadmap.roadmap?.weekly_plan && (
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-md p-6 max-w-4xl w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Weekly Plan</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {roadmap.roadmap.weekly_plan.map((week, idx) => (
              <div
                key={idx}
                className="p-4 bg-white/80 rounded-lg shadow-sm border-l-4 border-green-500"
              >
                <h3 className="text-lg font-semibold text-green-600 mb-2">
                  Week {week.week}
                </h3>
                <ul className="list-disc list-inside text-gray-700">
                  {week.focus.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
