"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function QuizPage() {
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Replace with roadmap.start_date from backend
  const roadmapStartDate = "2025-09-01"; // YYYY-MM-DD

  // Calculate week number
  const getWeekNumber = () => {
    const start = new Date(roadmapStartDate);
    const today = new Date();
    const diffDays = Math.floor((today - start) / (1000 * 60 * 60 * 24));
    return Math.floor(diffDays / 7) + 1;
  };

  // Fetch existing quizzes
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

        const currentWeek = getWeekNumber();

        let weekQuiz = data.quiz;

        if (weekQuiz) {
          setQuiz(weekQuiz);
        } else {
          setGenerating(true);
          const genRes = await fetch(
            "https://birjuram-ai.onrender.com/quiz/generate",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ week: currentWeek }),
            }
          );
          const genData = await genRes.json();
          setQuiz(genData.quiz);
          setGenerating(false);
        }
      } catch (err) {
        console.error("Error fetching quizzes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  // Handle selecting an option
  const handleOptionChange = (questionIndex, optIndex) => {
    const optionLetter = String.fromCharCode(65 + optIndex); // A, B, C, D
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionLetter,
    }));
  };

  // Submit quiz to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quiz) return;

    setSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      const payload = { answers }; 
      console.log("Answers are:",answers);// ✅ wrap answers under "answers" key

      const res = await fetch(
        "https://birjuram-ai.onrender.com/quiz/submit",
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
      console.log("Quiz submitted successfully:", data);
      alert("Quiz submitted successfully!");
    } catch (err) {
      console.error("Error submitting quiz:", err);
      alert("Failed to submit quiz. Try again.");
    } finally {
      setSubmitting(false);
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

  // Check if all questions are answered
  const allAnswered =
    quiz && Object.keys(answers).length === quiz.questions.length;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center px-8 py-6">
        <Link href="/" className="text-2xl font-extrabold text-blue-600">
          Birjuram.Ai
        </Link>
      </nav>

      {/* Quiz Section */}
      <main className="flex flex-1 items-center justify-center px-6">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-8 w-full max-w-3xl">
          <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
            Weekly Quiz – Week {quiz?.week}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {quiz?.questions?.map((q, index) => (
              <div
                key={q.id || index}
                className="p-4 bg-blue-50 border border-blue-200 rounded-xl shadow-sm"
              >
                <p className="font-medium text-gray-800">{q.question}</p>

                <div className="mt-3 space-y-2">
                  {q.options.map((opt, optIndex) => {
                    const optionLetter = String.fromCharCode(65 + optIndex); // A, B, C, D
                    return (
                      <label
                        key={optIndex}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={optionLetter}
                          checked={answers[index] === optionLetter}
                          onChange={() =>
                            handleOptionChange(index, optIndex)
                          }
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span>{opt}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Render submit button only if all questions answered */}
            {allAnswered && (
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
              >
                Submit Quiz
              </button>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}
