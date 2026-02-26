import { useMemo } from "react";
import { BarChart3, Users, TrendingUp, Award } from "lucide-react";
import { useQuiz } from "@/context/QuizContext";
import ScoreChart from "@/components/analytics/ScoreChart";
import AccuracyChart from "@/components/analytics/AccuracyChart";

const FALLBACK_TREND = [
  { name: "Week 1", score: 65, accuracy: 60 },
  { name: "Week 2", score: 70, accuracy: 68 }
];

const FALLBACK_STUDENTS = [
  { name: "Alice", avgScore: 88 },
  { name: "Bob", avgScore: 72 }
];

function StatCard({ title, value, icon: Icon, subtitle, trend }) {
  const trendColor =
    trend === "up"
      ? "text-success"
      : trend === "down"
      ? "text-destructive"
      : "text-muted-foreground";

  return (
    <div
      className="bg-card rounded-2xl p-5 flex items-start justify-between"
      style={{
        border: "1px solid hsl(var(--border))",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold text-foreground mt-1">
          {value ?? 0}
        </p>

        {subtitle && (
          <p className={`text-xs mt-1 ${trendColor}`}>
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
}

export default function Analytics() {
  const { attempts } = useQuiz();

  const totalAttempts = attempts.length;

  const activeStudents = useMemo(() => {
    const uniqueIds = new Set(attempts.map((attempt) => attempt.userId));
    return uniqueIds.size;
  }, [attempts]);

  const avgAccuracy = useMemo(() => {
    if (attempts.length === 0) return 0;

    const totalAccuracy = attempts.reduce((sum, attempt) => {
      const total =
        attempt.total ??
        attempt.totalQuestions ??
        1;

      return sum + (attempt.score / total) * 100;
    }, 0);

    return Math.round(totalAccuracy / attempts.length);
  }, [attempts]);

  const perfectScores = useMemo(() => {
    return attempts.filter((attempt) => {
      const total =
        attempt.total ??
        attempt.totalQuestions ??
        1;

      return attempt.score === total;
    }).length;
  }, [attempts]);

  const scoreTrendData = useMemo(() => {
    if (attempts.length === 0) {
      return FALLBACK_TREND;
    }

    return attempts.map((attempt, index) => {
      const total =
        attempt.total ??
        attempt.totalQuestions ??
        1;

      const percentage = Math.round(
        (attempt.score / total) * 100
      );

      return {
        name: `Week ${index + 1}`,
        score: percentage,
        accuracy: percentage,
      };
    });
  }, [attempts]);

  const studentScoreData = useMemo(() => {
    if (attempts.length === 0) {
      return FALLBACK_STUDENTS;
    }

    const studentMap = {};

    attempts.forEach((attempt) => {
      const name =
        attempt.userName ||
        String(attempt.userId) ||
        "Unknown";

      if (!studentMap[name]) {
        studentMap[name] = {
          name,
          total: 0,
          count: 0,
        };
      }

      const total =
        attempt.total ??
        attempt.totalQuestions ??
        1;

      studentMap[name].total +=
        (attempt.score / total) * 100;

      studentMap[name].count += 1;
    });

    return Object.values(studentMap).map((student) => ({
      name: student.name,
      avgScore: Math.round(
        student.total / student.count
      ),
    }));
  }, [attempts]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Analytics
        </h1>
        <p className="text-muted-foreground mt-1">
          Track student performance and quiz engagement
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Total Attempts"
          value={totalAttempts}
          icon={BarChart3}
        />

        <StatCard
          title="Active Students"
          value={activeStudents}
          icon={Users}
        />

        <StatCard
          title="Avg Accuracy"
          value={`${avgAccuracy}%`}
          icon={TrendingUp}
          trend="up"
          subtitle="+3% this week"
        />

        <StatCard
          title="Perfect Scores"
          value={perfectScores}
          icon={Award}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScoreChart data={scoreTrendData} />
        <AccuracyChart data={studentScoreData} />
      </div>
    </div>
  );
}