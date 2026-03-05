import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Award, Clock, TrendingUp } from "lucide-react";
import QuizCard from "@/components/quiz/QuizCard";
import { useQuiz } from "@/context/QuizContext";
import { useAuth } from "@/context/AuthContext";
import { getQuizHistory } from "@/services/quizService";

const StatCard = ({ title, value, icon: Icon, subtitle, trend }) => (
  <div className="bg-card rounded-2xl p-5 flex items-start justify-between"
    style={{ border: "1px solid hsl(var(--border))", boxShadow: "var(--shadow-sm)" }}>
    <div>
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
      {subtitle && (
        <p className={`text-xs mt-1 ${trend === "up" ? "text-success" : "text-muted-foreground"}`}>
          {subtitle}
        </p>
      )}
    </div>
    {Icon && (
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
    )}
  </div>
);

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { quizzes, loading } = useQuiz();
  const { user } = useAuth();

  const [history, setHistory] = useState([]);

  // Fetch real attempt history from backend
  useEffect(() => {
    getQuizHistory()
      .then(setHistory)
      .catch(() => setHistory([]));
  }, []);

  // quizzes from context are already published-only for students
  const totalAttempts = history.length;
  const avgScore = history.length > 0
    ? Math.round(history.reduce((sum, r) => sum + (r.percentage || 0), 0) / history.length)
    : 0;
  const bestScore = history.length > 0
    ? Math.max(...history.map((r) => r.percentage || 0))
    : 0;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back{user?.name ? `, ${user.name}` : ""}!
        </h1>
        <p className="text-muted-foreground mt-1">Here's your learning overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatCard title="Quizzes Taken" value={totalAttempts} icon={BookOpen} />
        <StatCard title="Avg Score" value={`${avgScore}%`} icon={Award} trend="up"
          subtitle={avgScore >= 70 ? "Great work!" : "Keep going!"} />
        <StatCard title="Best Score" value={`${bestScore}%`} icon={TrendingUp} />
        <StatCard title="Available" value={quizzes.length} icon={Clock} subtitle="quizzes ready" />
      </div>

      {/* Available quizzes */}
      <h2 className="text-xl font-semibold text-foreground mb-5">Available Quizzes</h2>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : quizzes.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center">No quizzes available yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {quizzes.map((q) => (
            <QuizCard
              key={q._id || q.id}
              title={q.title}
              description={q.description}
              difficulty={q.difficultyLevel || q.difficulty}
              timeLimit={q.timeLimit}
              questionCount={q.questionCount || 0}
              onAction={() => navigate(`/student/quizzes/${q._id || q.id}`)}
              actionLabel="Start Quiz"
            />
          ))}
        </div>
      )}
    </div>
  );
}