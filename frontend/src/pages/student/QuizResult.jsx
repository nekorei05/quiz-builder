import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, RotateCcw, Home, Lightbulb, ChevronLeft } from "lucide-react"; // ⬅️ add ChevronLeft
import { explainAnswer } from "@/services/aiService";

function QuestionRow({ item, index }) {
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [loadingExplanation, setLoadingExplanation] = useState(false);

  const { questionText, options = [], selected, correctAnswer, isCorrect } = item;

  const userAnswerText =
    selected !== null && selected !== undefined
      ? options[selected] ?? `Option ${selected + 1}`
      : "Not answered";

  const correctAnswerText = options[correctAnswer] ?? `Option ${correctAnswer + 1}`;

  async function handleExplain() {
    if (showExplanation) { setShowExplanation(false); return; }
    setShowExplanation(true);
    if (explanation) return;
    setLoadingExplanation(true);
    try {
      const res = await explainAnswer({ question: questionText, correctAnswer: correctAnswerText });
      setExplanation(res.explanation || "No explanation available.");
    } catch {
      setExplanation("Could not load explanation.");
    } finally {
      setLoadingExplanation(false);
    }
  }

  return (
    <div
      className={`rounded-2xl p-5 space-y-2 ${isCorrect ? "bg-success/5" : "bg-destructive/5"}`}
      style={{ border: `1px solid ${isCorrect ? "hsl(var(--success) / 0.2)" : "hsl(var(--destructive) / 0.2)"}` }}
    >
      <div className="flex items-start gap-2">
        {isCorrect
          ? <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
          : <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />}
        <p className="text-sm font-semibold text-foreground">Q{index + 1}: {questionText}</p>
      </div>
      <p className="text-xs text-muted-foreground pl-6">
        Your answer:{" "}
        <span className={isCorrect ? "text-success font-medium" : "text-destructive font-medium"}>
          {userAnswerText}
        </span>
        {!isCorrect && (
          <> · Correct: <span className="text-foreground font-medium">{correctAnswerText}</span></>
        )}
      </p>
      <button
        onClick={handleExplain}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors pl-6"
      >
        <Lightbulb className="w-3.5 h-3.5" />
        {showExplanation ? "Hide Explanation" : "Show AI Explanation"}
      </button>
      {showExplanation && (
        <div className="mt-2 mx-6 px-3 py-2.5 rounded-xl bg-warning/5 border border-warning/20 text-xs text-muted-foreground leading-relaxed">
          {loadingExplanation ? "Loading..." : <><span className="mr-1">💡</span>{explanation}</>}
        </div>
      )}
    </div>
  );
}

export default function QuizResult() {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Always fetch from backend — don't rely on location.state at all
  useEffect(() => {
    console.log("QuizResult useEffect, attemptId:", attemptId);  // add this

    if (!attemptId) {
      setError("No result ID found");
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/results/${attemptId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        //temp console log
        console.log("FETCH STATUS:", res.status);

        const data = await res.json();

        console.log("FETCH DATA:", data);  // add this

        if (!res.ok) throw new Error(data.message || "Failed to fetch result");

        //temp consolelog
        console.log("SETTING RESULT:", data.result);

        setResult(data.result);
        setQuiz(data.quiz);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {

        console.log("DONE LOADING");  // add this
        setLoading(false);
      }
    };

    load();
  }, [attemptId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  console.log("RENDER STATE - result:", result, "loading:", loading, "error:", error);

  if (error || !result) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center">
        <p className="text-muted-foreground">{error || "Result not found."}</p>
        <button onClick={() => navigate("/student")}
          className="mt-4 text-sm text-primary hover:underline">
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  const pct = result.percentage ?? Math.round((result.score / result.total) * 100);
  const colorClass = pct >= 70 ? "text-success" : pct >= 50 ? "text-warning" : "text-destructive";
  const bgClass = pct >= 70 ? "bg-success/10" : pct >= 50 ? "bg-warning/10" : "bg-destructive/10";
  const breakdown = result.breakdown || [];

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      {/* 🔙 Back to My Results (page 1) */}
      <div className="mb-4">
        <button
          onClick={() => navigate("/student/results?page=1", { replace: true })}
          className="inline-flex items-center gap-2 text-sm font-medium text-foreground px-3 py-2 rounded-xl hover:bg-muted/40 transition"
          aria-label="Back to My Results (page 1)"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to My Results
        </button>
      </div>

      <div
        className="bg-card rounded-2xl p-8 text-center mb-6"
        style={{ border: "1px solid hsl(var(--border))", boxShadow: "var(--shadow-sm)" }}
      >
        <div className={`w-24 h-24 rounded-full ${bgClass} flex items-center justify-center mx-auto mb-4`}>
          <span className={`text-3xl font-bold ${colorClass}`}>{pct}%</span>
        </div>
        <p className="text-xl font-bold text-foreground mb-1">{quiz?.title || "Quiz"}</p>
        <p className="text-sm text-muted-foreground">
          You scored <span className="font-semibold text-foreground">{result.score}</span> out of{" "}
          <span className="font-semibold text-foreground">{result.total}</span> questions
        </p>
        <p className={`text-sm font-semibold mt-2 ${colorClass}`}>
          {pct >= 70 ? "🎉 Great job!" : pct >= 50 ? "👍 Not bad!" : "📚 Keep practicing!"}
        </p>
      </div>

      {breakdown.length > 0 && (
        <div className="space-y-3 mb-6">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Question Breakdown
          </h2>
          {breakdown.map((item, i) => (
            <QuestionRow key={i} item={item} index={i} />
          ))}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => navigate(`/student/quizzes/${quiz?._id}`)}
          className="flex-1 flex items-center justify-center gap-2 border py-3 rounded-xl text-sm font-medium hover:bg-muted transition"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          <RotateCcw className="w-4 h-4" /> Retry Quiz
        </button>
        <button
          onClick={() => navigate("/student")}
          className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl text-sm font-medium hover:bg-primary/90 transition"
        >
          <Home className="w-4 h-4" /> Dashboard
        </button>
      </div>
    </div>
  );
}