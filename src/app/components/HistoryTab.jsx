"use client";
import { useState } from "react";

export default function HistoryTab({ type, onClose }) {
  // Placeholder data
  const roadmapHistory = [
    { id: 1, title: "Frontend Developer Roadmap", date: "Sep 15, 2025" },
    { id: 2, title: "Data Science Roadmap", date: "Sep 10, 2025" },
    { id: 3, title: "UI/UX Designer Roadmap", date: "Sep 05, 2025" },
  ];

  const counsellorHistory = [
    { id: 1, title: "Career Guidance: Switching to Tech", date: "Sep 14, 2025" },
    { id: 2, title: "Career Growth: Next Steps in UI/UX", date: "Sep 08, 2025" },
  ];

  const historyData = type === "roadmap" ? roadmapHistory : counsellorHistory;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-lg relative flex flex-col">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-6 text-blue-600 text-center">
          {type === "roadmap" ? "Previous Roadmaps" : "Career Counsellings"}
        </h2>

        {/* List */}
        <div className="space-y-4 overflow-y-auto max-h-[60vh]">
          {historyData.length > 0 ? (
            historyData.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-blue-50 border border-blue-200 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
              >
                <h3 className="font-semibold text-gray-800">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.date}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">
              No history available yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
