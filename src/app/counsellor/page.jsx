"use client";
import { useEffect, useState } from "react";

export default function CounsellorPage() {
  const [hasCounselling, setHasCounselling] = useState(false);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true); // 🔹 for initial fetch
  const [submitting, setSubmitting] = useState(false); // 🔹 for generating new counselling

  useEffect(() => {
    const token = localStorage.getItem("token");

    // 🔹 Check if user already has a counselling report
    const fetchCounsel = async () => {
      try {
        const res = await fetch("https://birjuram-ai.onrender.com/career", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.counseling_report) {
            setReport(data.counseling_report);
            setHasCounselling(true);
          }
        }
      } catch (error) {
        console.error("Error fetching career counsel:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounsel();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true); // start generating
    const token = localStorage.getItem("token");

    const formData = new FormData(e.target);
    const payload = {
      education: formData.get("education"),
      field: formData.get("field"),
      skills: formData.get("skills"),
      intent: formData.get("intent"),
    };

    try {
      const res = await fetch("https://birjuram-ai.onrender.com/career/counsel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        setReport(data.counseling_report);
        setHasCounselling(true);
      }
    } catch (error) {
      console.error("Error generating counsel:", error);
    } finally {
      setSubmitting(false); // stop loading
    }
  };

  // 🔹 Global loading screen (fetching or generating)
  if (loading || submitting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <p className="text-lg text-gray-600 animate-pulse">
          {submitting ? "Generating your counselling report..." : "Loading your counselling report..."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-6 py-12 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold text-blue-600 mb-8 text-center">
        Career Counsellor
      </h1>

      {hasCounselling && report ? (
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-md p-8 max-w-5xl w-full space-y-8">
          {/* Report Header */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {report.report_header.title}
            </h2>
            <p className="text-gray-600 mt-2">
              {report.report_header.introduction}
            </p>
          </div>

          {/* Profile Analysis */}
          <section>
            <h3 className="text-xl font-semibold text-blue-700 mb-2">
              Profile Analysis
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li><strong>Education:</strong> {report.profile_analysis.education}</li>
              <li><strong>Domain:</strong> {report.profile_analysis.interest_domain}</li>
              <li><strong>Skills:</strong> {report.profile_analysis.current_skills.join(", ")}</li>
              <li><strong>Goal:</strong> {report.profile_analysis.stated_goal}</li>
              <li><strong>Strengths:</strong> {report.profile_analysis.key_strengths.join(", ")}</li>
              <li><strong>Challenges:</strong> {report.profile_analysis.inferred_challenges}</li>
              <li><strong>Market Alignment:</strong> {report.profile_analysis.market_alignment}</li>
            </ul>
          </section>

          {/* Strategic Guidance */}
          <section>
            <h3 className="text-xl font-semibold text-blue-700 mb-2">
              Strategic Guidance
            </h3>
            <p><strong>Overview:</strong> {report.strategic_guidance.situational_overview}</p>
            <p><strong>Clarity Strategy:</strong> {report.strategic_guidance.clarity_strategy}</p>
            <p><strong>Recommendation:</strong> {report.strategic_guidance.overarching_recommendation}</p>
          </section>

          {/* Detailed Career Pathways */}
          <section>
            <h3 className="text-xl font-semibold text-blue-700 mb-4">
              Career Pathways
            </h3>
            <div className="space-y-6">
              {report.detailed_career_pathways.map((path, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
                >
                  <h4 className="text-lg font-bold text-gray-800">{path.role}</h4>
                  <p className="text-gray-600">{path.role_overview.description}</p>

                  <h5 className="mt-2 font-medium text-gray-700">Day in the Life</h5>
                  <p className="text-gray-600">{path.role_overview.day_in_the_life}</p>

                  <h5 className="mt-2 font-medium text-gray-700">Responsibilities</h5>
                  <ul className="list-disc list-inside text-gray-600">
                    {path.role_overview.key_responsibilities.map((res, i) => (
                      <li key={i}>{res}</li>
                    ))}
                  </ul>

                  <h5 className="mt-2 font-medium text-gray-700">Reality Check</h5>
                  <p className="text-gray-600">{path.reality_check}</p>

                  <h5 className="mt-2 font-medium text-gray-700">Learning Resources</h5>
                  <ul className="list-disc list-inside text-blue-600">
                    {path.recommended_learning_resources.map((res, i) => (
                      <li key={i}>{res}</li>
                    ))}
                  </ul>

                  <h5 className="mt-2 font-medium text-gray-700">Networking Tip</h5>
                  <p className="text-gray-600">{path.networking_and_branding_tip}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Conclusion */}
          <section>
            <h3 className="text-xl font-semibold text-blue-700 mb-2">
              Conclusion
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {report.concluding_summary.immediate_actions.map((action, idx) => (
                <li key={idx}>{action}</li>
              ))}
            </ul>
            <p className="mt-2 text-gray-600 italic">
              {report.concluding_summary.final_encouragement}
            </p>
          </section>
        </div>
      ) : (
        // Form for new counselling
        <form
          onSubmit={handleSubmit}
          className="bg-white/70 backdrop-blur-md rounded-2xl shadow-md p-8 max-w-2xl w-full space-y-6"
        >
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Education
            </label>
            <input
              name="education"
              placeholder="e.g., B.Tech in Computer Science"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Field of Interest
            </label>
            <input
              name="field"
              placeholder="e.g., Software Development"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Current Skills
            </label>
            <textarea
              name="skills"
              placeholder="e.g., Python, React, SQL"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Your Intent
            </label>
            <textarea
              name="intent"
              placeholder="e.g., Want to explore a stable career field despite layoffs"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold shadow-md transition"
          >
            Get Counselling
          </button>
        </form>
      )}
    </div>
  );
}
