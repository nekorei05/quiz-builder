import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Clock, ChevronRight } from "lucide-react";
import { getQuizHistory } from "@/services/quizService";

function difficultyColor(d) {
  if (d === "easy") return "text-success bg-success/10";
  if (d === "hard") return "text-destructive bg-destructive/10";
  return "text-warning bg-warning/10";
}

function scoreColor(pct) {
  if (pct >= 80) return "text-success";
  if (pct >= 60) return "text-warning";
  return "text-destructive";
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export default function MyResults() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getQuizHistory()
      .then(setHistory)
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">My Results</h1>
        <p className="text-muted-foreground mt-1">All your quiz attempts</p>
      </div>

      {history.length === 0 ? (
        <div className="bg-card rounded-2xl p-16 text-center"
          style={{ border: "1px solid hsl(var(--border))" }}>
          <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-semibold text-foreground">No attempts yet</p>
          <p className="text-sm text-muted-foreground mt-1">Start a quiz to see your results here</p>
          <button
            onClick={() => navigate("/student/quizzes")}
            className="mt-6 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition"
          >
            Browse Quizzes
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((r) => {
            const pct = r.percentage ?? Math.round((r.score / r.total) * 100);
            const passed = pct >= 60;
            const quizTitle = r.quizId?.title || "Quiz";
            const difficulty = r.quizId?.difficultyLevel || "medium";

            return (
              <button
                key={r._id}
                onClick={() => navigate(`/student/results/${r._id}`)}
                className="w-full bg-card rounded-2xl p-5 flex items-center justify-between hover:bg-muted/30 transition text-left"
                style={{ border: "1px solid hsl(var(--border))", boxShadow: "var(--shadow-sm)" }}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    passed ? "bg-success/10" : "bg-destructive/10"
                  }`}>
                    {passed
                      ? <CheckCircle className="w-5 h-5 text-success" />
                      : <XCircle className="w-5 h-5 text-destructive" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{quizTitle}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${difficultyColor(difficulty)}`}>
                        {difficulty}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(r.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`text-xl font-bold ${scoreColor(pct)}`}>{pct}%</p>
                    <p className="text-xs text-muted-foreground">{r.score}/{r.total} correct</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}