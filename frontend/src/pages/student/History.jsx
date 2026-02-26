import { Award, Target, TrendingUp, Zap } from "lucide-react";
import { useQuiz } from "@/context/QuizContext";
import { useAuth } from "@/context/AuthContext";
import ProgressChart from "@/components/analytics/ProgressChart";

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
          className={`text-xs mt-1 ${
            trend === "up"
              ? "text-success"
              : trend === "down"
              ? "text-destructive"
              : "text-muted-foreground"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
      <Icon className="w-5 h-5 text-primary" />
    </div>
  </div>
);

const History = () => {
  const { attempts } = useQuiz();
  const { user } = useAuth();

  const userAttempts = attempts.filter((a) =>
    user?.id ? String(a.userId) === String(user.id) : true
  );

  const totalScore = userAttempts.reduce((acc, a) => acc + (a.score || 0), 0);
  const totalQuestions = userAttempts.reduce(
    (acc, a) => acc + (a.total ?? a.totalQuestions ?? 0),
    0
  );
  const avgPct =
    totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;

  const chartData = userAttempts.length > 0
    ? userAttempts.map((a, i) => ({
        name: `Week ${i + 1}`,
        score: Math.round(((a.score || 0) / (a.total ?? a.totalQuestions ?? 1)) * 100),
      }))
    : [
        { name: "Week 1", score: 65 },
        { name: "Week 2", score: 70 },
        { name: "Week 3", score: 75 },
        { name: "Week 4", score: 80 },
        { name: "Week 5", score: 87 },
        { name: "Week 6", score: 92 },
      ];

  return (
    <div className="p-8 max-w-7xl mx-auto">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">My Analytics</h1>
        <p className="text-muted-foreground mt-1">Track your learning progress</p>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatCard
          title="Overall Score"
          value={`${avgPct}%`}
          icon={Award}
          trend="up"
          subtitle="Above average"
        />
        <StatCard
          title="Accuracy"
          value="82%"
          icon={Target}
        />
        <StatCard
          title="Improvement"
          value="+12%"
          icon={TrendingUp}
          trend="up"
          subtitle="vs last month"
        />
        <StatCard
          title="Quizzes Completed"
          value={userAttempts.length}
          icon={Zap}
        />
      </div>


      <ProgressChart data={chartData} />
    </div>
  );
};

export default History;