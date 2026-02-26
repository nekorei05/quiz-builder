import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Lightbulb } from "lucide-react";
import { useQuiz } from "@/context/QuizContext";
import { useAuth } from "@/context/AuthContext";
import { explainAnswer } from "@/services/aiService";
import EmptyState from "@/components/ui/EmptyState";


function QuestionRow({ question, index, userAnswerIdx }) {
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [loadingExplanation, setLoadingExplanation] = useState(false);

  const correctIdx = question.correctAnswer ?? question.answer ?? -1;
  const isCorrect = userAnswerIdx === correctIdx;

  const userAnswerText =
    userAnswerIdx !== undefined && userAnswerIdx !== null
      ? question.options?.[userAnswerIdx] ?? "—"
      : "Not answered";

  const correctAnswerText = question.options?.[correctIdx] ?? "—";

  const handleToggleExplanation = async () => {
    if (showExplanation) { setShowExplanation(false); return; }
    setShowExplanation(true);
    if (explanation) return; 
    setLoadingExplanation(true);
    try {
      const res = await explainAnswer({ question: question.text, correctAnswer: correctAnswerText });
      setExplanation(res.explanation || "No explanation available.");
    } catch {
      setExplanation("Could not load explanation.");
    } finally {
      setLoadingExplanation(false);
    }
  };

  return (
    <div
      className={`rounded-2xl p-5 space-y-2 ${
        isCorrect ? "bg-success/5" : "bg-destructive/5"
      }`}
      style={{
        border: `1px solid ${isCorrect ? "hsl(var(--success) / 0.2)" : "hsl(var(--destructive) / 0.2)"}`,
      }}
    >

      <p className="text-sm font-semibold text-foreground">
        Q{index + 1}: {question.text}
      </p>


      <p className="text-xs text-muted-foreground">
        Your answer:{" "}
        <span className={isCorrect ? "text-success font-medium" : "text-destructive font-medium"}>
          {userAnswerText}
        </span>
        {!isCorrect && (
          <>
            {" · "}Correct:{" "}
            <span className="text-foreground font-medium">{correctAnswerText}</span>
          </>
        )}
      </p>


      <button
        onClick={handleToggleExplanation}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
      >
        <Lightbulb className="w-3.5 h-3.5" />
        {showExplanation ? "Hide AI Explanation" : "Show AI Explanation"}
      </button>

      {showExplanation && (
        <div className="mt-2 px-3 py-2.5 rounded-xl bg-warning/5 border border-warning/20 text-xs text-muted-foreground leading-relaxed">
          {loadingExplanation ? (
            "Loading explanation..."
          ) : (
            <>
              <span className="mr-1">💡</span>
              {explanation}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function QuizResult() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const { attempts, quizzes } = useQuiz();
  const { user } = useAuth();


  if (attemptId) {
    const attempt = attempts.find((a) => String(a.id) === String(attemptId));

    if (!attempt) {
      return (
        <div className="p-8 max-w-2xl mx-auto">
          <EmptyState title="Result not found" description="This attempt could not be found." />
          <button
            onClick={() => navigate("/student/results")}
            className="mt-4 text-sm text-primary hover:underline"
          >
            ← Back to results
          </button>
        </div>
      );
    }

    const totalQuestions = attempt.total ?? attempt.questions?.length ?? 0;
    const score = attempt.score ?? 0;
    const pct = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

    const colorClass =
      pct >= 70 ? "text-success" : pct >= 50 ? "text-warning" : "text-destructive";


    const questions =
      attempt.questions ||
      quizzes.find((q) => String(q.id) === String(attempt.quizId))?.questions ||
      [];

    return (
      <div className="max-w-2xl mx-auto py-10 px-4">


        <div
          className="bg-card rounded-2xl p-8 text-center mb-6"
          style={{ border: "1px solid hsl(var(--border))", boxShadow: "var(--shadow-sm)" }}
        >
          <div className={`text-6xl font-bold mb-2 ${colorClass}`}>{pct}%</div>
          <p className="text-lg font-semibold text-foreground mb-1">
            {attempt.quizTitle ||
              quizzes.find((q) => String(q.id) === String(attempt.quizId))?.title ||
              "Quiz"}
          </p>
          <p className="text-sm text-muted-foreground">
            You scored {score} out of {totalQuestions} questions
          </p>
        </div>


        <div className="space-y-3 mb-6">
          {questions.map((q, i) => (
            <QuestionRow
              key={q.id ?? i}
              question={q}
              index={i}
              userAnswerIdx={attempt.answers?.[q.id]}
            />
          ))}
        </div>

 
        <button
          onClick={() => navigate("/student")}
          className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium text-sm hover:bg-primary/90 transition"
        >
          Back to Dashboard
        </button>

      </div>
    );
  }


  const userAttempts = attempts.filter((a) =>
    user?.id ? String(a.userId) === String(user.id) : true
  );

  if (userAttempts.length === 0) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Results</h1>
          <p className="text-muted-foreground mt-1">Review your quiz attempt history</p>
        </div>
        <EmptyState title="No attempts yet" description="Take a quiz to see your results here" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">My Results</h1>
        <p className="text-muted-foreground mt-1">Review your quiz attempt history</p>
      </div>

      <div
        className="bg-card rounded-2xl overflow-hidden"
        style={{ border: "1px solid hsl(var(--border))", boxShadow: "var(--shadow-sm)" }}
      >
        {userAttempts.map((attempt, i) => {
          const total = attempt.total ?? 0;
          const score = attempt.score ?? 0;
          const pct = total > 0 ? Math.round((score / total) * 100) : 0;
          const passed = pct >= 70;
          const title =
            attempt.quizTitle ||
            quizzes.find((q) => String(q.id) === String(attempt.quizId))?.title ||
            "Untitled Quiz";
          const date = attempt.completedAt
            ? new Date(attempt.completedAt).toLocaleDateString("en-CA")
            : "—";
          const timeInMinutes = attempt.timeTaken
            ? Math.round(attempt.timeTaken / 60)
            : null;

          return (
            <button
              key={attempt.id}
              onClick={() => navigate(`/student/results/${attempt.id}`)}
              className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-muted/30 transition-colors"
              style={i < userAttempts.length - 1 ? { borderBottom: "1px solid hsl(var(--border))" } : {}}
            >

              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                  passed ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                }`}
              >
                {passed ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>


              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{date}</p>
              </div>


              <div className="flex items-center gap-3 shrink-0">
                {timeInMinutes !== null && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M12 6v6l4 2" />
                    </svg>
                    {timeInMinutes}m
                  </span>
                )}
                <span className={`text-sm font-semibold ${passed ? "text-success" : "text-destructive"}`}>
                  {score}/{total} ({pct}%)
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
