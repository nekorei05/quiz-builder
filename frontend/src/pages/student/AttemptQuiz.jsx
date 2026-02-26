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
  const { quizzes, addAttempt } = useQuiz();
  const { success: toastSuccess, error: toastError, info: toastInfo } = useToast();

  const quiz = quizzes.find((q) => String(q.id) === String(quizId));

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!quiz) toastError("Quiz not found");
  }, [quiz]);

  const score = quiz
    ? quiz.questions.reduce((acc, q) => {
        return acc + (answers[q.id] === (q.correctAnswer ?? q.answer) ? 1 : 0);
      }, 0)
    : 0;

  const totalQuestions = quiz?.questions.length ?? 0;

  const handleSubmit = useCallback(() => {
    if (!quiz || submitted) return;
    setSubmitted(true);

    const attemptId = `result-${Date.now()}`;
    addAttempt?.({
      id: attemptId,
      quizId: quiz.id,
      quizTitle: quiz.title,
      score,
      total: totalQuestions,
      completedAt: new Date().toISOString(),
      answers,

      questions: quiz.questions,
    });

    toastSuccess(`Submitted! Score: ${score}/${totalQuestions}`);
    navigate(`/student/results/${attemptId}`, { replace: true });
  }, [quiz, answers, submitted, score, totalQuestions, addAttempt, navigate]);

  const antiCheat = useAntiCheat(!submitted, handleSubmit, 2);
  const { timeLeft } = useTimer((quiz?.timeLimit ?? 10) * 60, handleSubmit, !submitted && !!quiz);

  if (!quiz) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Quiz not found</p>
      </div>
    );
  }

  const question = quiz.questions[current];

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
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
                antiCheat.violations > 0
                  ? "bg-destructive/10 text-destructive"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <Shield className="w-3 h-3" />
              {antiCheat.violations}/{antiCheat.maxViolations}
            </div>
            {!antiCheat.isFullscreen && (
              <button
                onClick={() => { antiCheat.requestFullscreen(); toastInfo("Fullscreen enabled"); }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium text-foreground hover:bg-muted transition"
                style={{ borderColor: "hsl(var(--border))" }}
              >
                <Maximize className="w-3 h-3" />
                Fullscreen
              </button>
            )}
            <QuizTimer timeLeft={timeLeft} />
          </div>
        </div>

        <ProgressBar value={Object.keys(answers).length} max={totalQuestions} className="mb-6" />

        <QuestionCard
          question={question}
          selectedAnswer={answers[question.id]}
          onSelect={(idx) => setAnswers((prev) => ({ ...prev, [question.id]: idx }))}
        />

        <QuizNav questions={quiz.questions} answers={answers} current={current} onNavigate={setCurrent} />


        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
            className="flex items-center gap-1 px-4 py-2.5 rounded-xl border text-sm font-medium text-foreground hover:bg-muted transition disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
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
              className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition"
            >
              Submit <Send className="w-4 h-4" />
            </button>
          )}
        </div>

      </AntiCheatWrapper>
    </div>
  );
}
