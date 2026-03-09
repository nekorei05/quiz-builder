import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Send, Shield, Maximize } from "lucide-react";
import QuestionCard from "@/components/quiz/QuestionCard";
import QuizTimer from "@/components/quiz/QuizTimer";
import QuizNav from "@/components/quiz/QuizNav";
import AntiCheatWrapper from "@/components/anticheat/AntiCheatWrapper";
import ProgressBar from "@/components/ui/ProgressBar";
import { useAntiCheat } from "@/hooks/useAntiCheat";
import { useTimer } from "@/hooks/useTimer";
import { useQuiz } from "@/context/QuizContext";
import { useToast } from "@/hooks/useToast";

export default function AttemptQuiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { submitQuiz } = useQuiz(); 
  const { success: toastSuccess, error: toastError, info: toastInfo } = useToast();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Fetch quiz + questions from backend
  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/quizzes/${quizId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load quiz");
        setQuiz(data.quiz);
        setQuestions(Array.isArray(data.questions) ? data.questions : []);
      } catch (err) {
        toastError(err.message || "Error loading quiz");
      }
    };
    load();
  }, [quizId]);

  const question = questions[current];
  const totalQuestions = questions.length;

  const handleSubmit = useCallback(async () => {
    if (!quiz || submitted) return;
    setSubmitted(true);

    try {
      const answersArray = questions.map((q) => answers[q._id] ?? null);

const result = await submitQuiz(quizId, answersArray);

//temp console log
   console.log("SUBMIT QUIZ RESPONSE:", result);

      toastSuccess(`Submitted! Score: ${result.score}/${result.total}`);
      console.log("NAVIGATING TO:", `/student/results/${result.resultId}`);
      
// Navigate to result page with resultId from backend
      navigate(`/student/results/${result.resultId}`, {
  state: { result, quiz, questions },
});
    } catch (err) {
      toastError(err.message || "Failed to submit quiz");
      setSubmitted(false);
    }
  }, [quiz, submitted, questions, answers, quizId, submitQuiz, navigate, toastSuccess, toastError]);

  const antiCheat = useAntiCheat(!submitted, handleSubmit, 2);
  const { timeLeft } = useTimer((quiz?.timeLimit ?? 10) * 60, handleSubmit, !submitted && !!quiz);

  if (!quiz) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!question) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">This quiz has no questions.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <AntiCheatWrapper antiCheat={antiCheat}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-lg font-bold text-foreground">{quiz.title}</h1>
            <p className="text-sm text-muted-foreground">
              Question {current + 1} of {totalQuestions}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
              antiCheat.violations > 0 ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"
            }`}>
              <Shield className="w-3 h-3" />
              {antiCheat.violations}/{antiCheat.maxViolations}
            </div>
            {!antiCheat.isFullscreen && (
              <button
                onClick={() => { antiCheat.requestFullscreen(); toastInfo("Fullscreen enabled"); }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium hover:bg-muted transition"
                style={{ borderColor: "hsl(var(--border))" }}
              >
                <Maximize className="w-3 h-3" /> Fullscreen
              </button>
            )}
            <QuizTimer timeLeft={timeLeft} />
          </div>
        </div>

        <ProgressBar value={Object.keys(answers).length} max={totalQuestions} className="mb-6" />

        <QuestionCard
          question={question}
          selectedAnswer={answers[question._id]}
          onSelect={(idx) => setAnswers((prev) => ({ ...prev, [question._id]: idx }))}
        />

        <QuizNav
          questions={questions}
          answers={answers}
          current={current}
          onNavigate={setCurrent}
        />

        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
            className="flex items-center gap-1 px-4 py-2.5 rounded-xl border text-sm font-medium hover:bg-muted transition disabled:opacity-40"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          {current < totalQuestions - 1 ? (
            <button
              onClick={() => setCurrent((c) => c + 1)}
              className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitted}
              className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition disabled:opacity-60"
            >
              <Send className="w-4 h-4" /> {submitted ? "Submitting..." : "Submit"}
            </button>
          )}
        </div>
      </AntiCheatWrapper>
    </div>
  );
}