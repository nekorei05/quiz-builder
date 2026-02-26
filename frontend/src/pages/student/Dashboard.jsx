import { useNavigate } from "react-router-dom";
import { BookOpen, Award, Clock, TrendingUp, Flame } from "lucide-react";
import QuizCard from "@/components/quiz/QuizCard";
import { useQuiz } from "@/context/QuizContext";
import { useAuth } from "@/context/AuthContext";

const StatCard = ({ title, value, icon: Icon, subtitle, trend }) => (
  <div
    className="bg-card rounded-2xl p-5 flex items-start justify-between"
    style={{ border: "1px solid hsl(var(--border))", boxShadow: "var(--shadow-sm)" }}
  >
    <div>
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
      {subtitle && (
        <p
          className={`text-xs mt-1 flex items-center gap-1 ${
            trend === "up" ? "text-success" : trend === "fire" ? "text-warning" : "text-muted-foreground"
          }`}
        >
          {trend === "fire" && <Flame className="w-3 h-3" />}
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

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { quizzes, attempts } = useQuiz();
  const { user } = useAuth();

  const publishedQuizzes = quizzes.filter(q => q.status === "published");

  const userAttempts = attempts.filter(a => user?.id ? String(a.userId) === String(user.id) : true);

  const totalScore = userAttempts.reduce((acc, a) => acc + (a.score || 0), 0);
  const totalQuestions = userAttempts.reduce(
    (acc, a) => acc + (a.total ?? a.totalQuestions ?? 0),
    0
  );
  const avgScore = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;

  return (
    <div className="p-8 max-w-7xl mx-auto">


      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's your learning overview</p>
      </div>

 
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatCard title="Quizzes Taken" value={userAttempts.length} icon={BookOpen} />
        <StatCard title="Avg Score" value={`${avgScore}%`} icon={Award} trend="up" subtitle="Keep it up!" />
        <StatCard title="Time Spent" value="36 min" icon={Clock} />
        <StatCard title="Streak" value="5 days" icon={TrendingUp} trend="fire" subtitle="On fire!" />
      </div>


      <h2 className="text-xl font-semibold text-foreground mb-5">Available Quizzes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {publishedQuizzes.length === 0 ? (
          <p className="text-muted-foreground col-span-2 py-8 text-center">
            No quizzes available yet.
          </p>
        ) : (
          publishedQuizzes.map(q => (
            <QuizCard
              key={q.id}
              title={q.title}
              description={q.description}
              difficulty={q.difficulty}
              timeLimit={q.timeLimit}
              questionCount={q.questions?.length || 0}
              onAction={() => navigate(`/student/quizzes/${q.id}`)}
              actionLabel="Start Quiz"
            />
          ))
        )}
      </div>

    </div>
  );
};

export default StudentDashboard;

