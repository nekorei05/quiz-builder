import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "@/context/QuizContext";
import { BookOpen, Users, BarChart3, TrendingUp, Clock, HelpCircle, ArrowRight, Plus } from "lucide-react";
import { getAdminAnalytics } from "@/services/analyticsService";

export default function Dashboard() {
  const navigate = useNavigate();
  const { quizzes = [] } = useQuiz();

  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  useEffect(() => {
    getAdminAnalytics()
      .then(setAnalytics)
      .catch(() => setAnalytics(null))
      .finally(() => setLoadingAnalytics(false));
  }, []);

  const stats = [
    {
      title: "Total Quizzes",
      value: quizzes.length,
      subtitle: "your published + drafts",
      icon: BookOpen,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      title: "Active Students",
      value: loadingAnalytics ? "—" : (analytics?.activeStudents ?? 0),
      subtitle: "unique students",
      icon: Users,
      iconBg: "bg-info/10",
      iconColor: "text-info",
    },
    {
      title: "Avg Score",
      value: loadingAnalytics ? "—" : `${analytics?.avgAccuracy ?? 0}%`,
      subtitle: "across all attempts",
      icon: BarChart3,
      iconBg: "bg-warning/10",
      iconColor: "text-warning",
    },
    {
      title: "Perfect Scores",
      value: loadingAnalytics ? "—" : (analytics?.perfectScores ?? 0),
      subtitle: `of ${analytics?.totalAttempts ?? 0} total attempts`,
      icon: TrendingUp,
      iconBg: "bg-success/10",
      iconColor: "text-success",
    },
  ];

  const recentQuizzes = quizzes.slice(-4);
  const topStudents = analytics?.topStudents ?? [];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your quizzes and student performance</p>
        </div>
        <button
          onClick={() => navigate("/admin/create")}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl hover:bg-primary/90 transition font-medium"
        >
          <Plus className="w-4 h-4" /> New Quiz
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-card rounded-2xl p-5 flex items-start justify-between"
              style={{ border: "1px solid hsl(var(--border))", boxShadow: "var(--shadow-sm)" }}
            >
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <h3 className="text-3xl font-bold text-foreground mt-2">{stat.value}</h3>
                <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
              </div>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.iconBg}`}>
                <Icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Quizzes */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-foreground">Recent Quizzes</h2>
          <button
            onClick={() => navigate("/admin/quizzes")}
            className="text-sm text-primary hover:underline"
          >
            View all
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {recentQuizzes.length === 0 ? (
            <p className="text-muted-foreground col-span-2 py-8 text-center">
              No quizzes yet. Create your first quiz!
            </p>
          ) : (
            recentQuizzes.map((quiz) => {
              const id = quiz._id || quiz.id;
              return (
                <DashQuizCard
                  key={id}
                  quiz={{ ...quiz, difficulty: quiz.difficultyLevel || quiz.difficulty }}
                  onView={() => navigate(`/admin/quizzes/edit/${id}`)}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Top Students */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-5">Top Students</h2>
        <div
          className="bg-card rounded-2xl overflow-hidden"
          style={{ border: "1px solid hsl(var(--border))", boxShadow: "var(--shadow-sm)" }}
        >
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid hsl(var(--border))" }}>
                {["Name", "Attempts", "Avg Score", "Email"].map((h) => (
                  <th
                    key={h}
                    className="text-left text-xs font-medium text-muted-foreground px-6 py-3 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loadingAnalytics ? (
                <tr>
                  <td colSpan={4} className="text-center py-10">
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : topStudents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-muted-foreground py-10 text-sm">
                    No student attempts yet.
                  </td>
                </tr>
              ) : (
                topStudents.map((student, i) => (
                  <tr
                    key={i}
                    className="hover:bg-muted/30 transition-colors"
                    style={i < topStudents.length - 1 ? { borderBottom: "1px solid hsl(var(--border))" } : undefined}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                          {String(student.name)[0]?.toUpperCase() || "?"}
                        </div>
                        <p className="text-sm font-medium text-foreground">{student.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{student.attempts}</td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-bold ${
                        student.avgScore >= 80 ? "text-success"
                        : student.avgScore >= 60 ? "text-warning"
                        : "text-destructive"
                      }`}>
                        {student.avgScore}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{student.email || "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DashQuizCard({ quiz, onView }) {
  const difficulty = quiz.difficulty || "easy";
  const difficultyStyles = {
    easy: "bg-primary/10 text-primary border-primary/20",
    medium: "bg-warning/10 text-warning border-warning/20",
    hard: "bg-destructive/10 text-destructive border-destructive/20",
  };
  const diffClass = difficultyStyles[difficulty] || "bg-muted text-muted-foreground border-border";

  return (
    <div
      className="bg-card rounded-2xl p-6 flex flex-col gap-3"
      style={{ border: "1px solid hsl(var(--border))", boxShadow: "var(--shadow-sm)" }}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-foreground">{quiz.title}</h3>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-medium ${diffClass}`}>
            {difficulty}
          </span>
          {quiz.isPublished !== undefined && (
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
              {quiz.isPublished ? "published" : "draft"}
            </span>
          )}
        </div>
      </div>
      {quiz.description && (
        <p className="text-sm text-muted-foreground line-clamp-2">{quiz.description}</p>
      )}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />{quiz.timeLimit ?? 10} min
        </span>
        <span className="flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5" />{quiz.questionCount ?? 0} questions
        </span>
      </div>
      <button
        onClick={onView}
        className="mt-2 w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-xl hover:bg-primary/90 transition font-medium text-sm"
      >
        View Details <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}