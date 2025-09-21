"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function QuizPage() {
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState([]);
  const [answers, setAnswers] = useState({});
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Replace with roadmap duration from backend
  const roadmapDuration = 4; // Example: 4 weeks roadmap

  // Fetch all quizzes
  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchQuizzes = async () => {
      try {
        const res = await fetch("https://birjuram-ai.onrender.com/quiz", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setQuizzes(data.quizzes || []);
        console.log("Quizzes are:", data);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  // Handle selecting an option
  const handleOptionChange = (week, questionIndex, optIndex) => {
    const optionLetter = String.fromCharCode(65 + optIndex); // A, B, C, D
    setAnswers((prev) => ({
      ...prev,
      [week]: {
        ...(prev[week] || {}),
        [questionIndex]: optionLetter,
      },
    }));
  };

  // Normalize option text (remove duplicate "A:" etc.)
  const formatOptionText = (opt, letter) => {
    // remove leading "A:", "B:", etc. if backend already provided
    const cleaned = opt.replace(/^[A-D]:\s*/, "").trim();
    return `${letter}) ${cleaned}`;
  };

  // Submit quiz
  const handleSubmit = async (e, quiz) => {
    e.preventDefault();
    if (!quiz) return;

    setSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      const payload = { answers: answers[quiz.week] || {} };

      const res = await fetch("https://birjuram-ai.onrender.com/quiz/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ week: quiz.week, ...payload }),
      });

      const data = await res.json();
      console.log("Quiz submitted successfully:", data);

      setQuizzes((prev) =>
        prev.map((q) => (q.week === quiz.week ? { ...q, ...data.quiz } : q))
      );
      alert("Quiz submitted successfully!");
    } catch (err) {
      console.error("Error submitting quiz:", err);
      alert("Failed to submit quiz. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Generate new week quiz
  const handleGenerateQuiz = async (week) => {
    setGenerating(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("https://birjuram-ai.onrender.com/quiz/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ week }),
      });
      const data = await res.json();
      setQuizzes((prev) => [...prev, data.quiz]);
    } catch (err) {
      console.error("Error generating quiz:", err);
      alert("Failed to generate quiz. Try again.");
    } finally {
      setGenerating(false);
    }
  };

  // Loading / generating / submitting screen
  if (loading || generating || submitting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-blue-600">
            {generating
              ? "Generating your quiz..."
              : submitting
              ? "Submitting your quiz..."
              : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center px-8 py-6">
        <Link href="/" className="text-2xl font-extrabold text-blue-600">
          Birjuram.Ai
        </Link>
      </nav>

      {/* Quiz Section */}
      <main className="flex flex-1 flex-col items-center justify-start px-6 py-8 space-y-8">
        {Array.from({ length: roadmapDuration }).map((_, i) => {
          const week = i + 1;
          const quiz = quizzes.find((q) => q.week === week);

          return (
            <div
              key={week}
              className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-8 w-full max-w-3xl"
            >
              <h2 className="text-2xl font-bold text-blue-600 mb-4">
                Week {week} Quiz
              </h2>

              {/* Case 1: Quiz not generated */}
              {!quiz && (
                <button
                  onClick={() => handleGenerateQuiz(week)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"
                >
                  Generate Week {week} Quiz
                </button>
              )}

              {/* Case 2: Quiz exists but not submitted */}
              {quiz && !quiz.submitted && (
                <form
                  onSubmit={(e) => handleSubmit(e, quiz)}
                  className="space-y-6"
                >
                  {quiz.questions?.map((q, index) => (
                    <div
                      key={q.id || index}
                      className="p-4 bg-blue-50 border border-blue-200 rounded-xl shadow-sm"
                    >
                      <p className="font-medium text-gray-800">{q.question}</p>
                      <div className="mt-3 space-y-2">
                        {q.options.map((opt, optIndex) => {
                          const optionLetter = String.fromCharCode(
                            65 + optIndex
                          );
                          return (
                            <label
                              key={optIndex}
                              className="flex items-center space-x-2 cursor-pointer"
                            >
                              <input
                                type="radio"
                                name={`week-${week}-question-${index}`}
                                value={optionLetter}
                                checked={
                                  answers[week]?.[index] === optionLetter
                                }
                                onChange={() =>
                                  handleOptionChange(week, index, optIndex)
                                }
                                className="text-blue-600 focus:ring-blue-500"
                              />
                              {/* ✅ Consistent option formatting */}
                              <span className="text-gray-800">
                                {formatOptionText(opt, optionLetter)}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {answers[week] &&
                    Object.keys(answers[week]).length ===
                      quiz.questions.length && (
                      <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
                      >
                        Submit Quiz
                      </button>
                    )}
                </form>
              )}

              {/* Case 3: Quiz submitted */}
              {quiz && quiz.submitted && (
                <div>
                  <p className="text-lg font-semibold text-gray-700 mb-4">
                    ✅ You scored {quiz.score} / {quiz.questions.length * 10}
                  </p>
                  <div className="space-y-4">
                    {quiz.questions.map((q, index) => {
                      const correct = q.answer; // backend gives `answer` (like "C")
                      const userAnswer = quiz.answers?.[index];
                      return (
                        <div
                          key={index}
                          className="p-4 border rounded-xl bg-gray-50"
                        >
                          <p className="font-medium">{q.question}</p>
                          
                          {userAnswer !== correct && (
                            <p className="text-green-600">
                              Correct Answer: {correct}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </main>
    </div>
  );
}
