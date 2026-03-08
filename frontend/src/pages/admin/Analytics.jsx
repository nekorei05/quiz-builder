import { useState, useEffect } from "react";
import { BarChart3, Users, TrendingUp, Award } from "lucide-react";
import ScoreChart from "@/components/analytics/ScoreChart";
import AccuracyChart from "@/components/analytics/AccuracyChart";
import { getAdminAnalytics } from "@/services/analyticsService";

function StatCard({ title, value, icon: Icon, subtitle, trend }) {
  const trendColor =
    trend === "up" ? "text-success" : trend === "down" ? "text-destructive" : "text-muted-foreground";

  return (
    <div className="bg-card rounded-2xl p-5 flex items-start justify-between"
      style={{ border: "1px solid hsl(var(--border))", boxShadow: "var(--shadow-sm)" }}>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold text-foreground mt-1">{value ?? 0}</p>
        {subtitle && <p className={`text-xs mt-1 ${trendColor}`}>{subtitle}</p>}
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
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAdminAnalytics()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <p className="text-destructive text-sm">Failed to load analytics: {error}</p>
      </div>
    );
  }

  // ScoreChart expects [{ name, score, accuracy }]
  const scoreTrendData = (data?.scoreTrend ?? []).map((d) => ({
    name: d.date ?? d.name,
    score: d.avgScore ?? d.score ?? 0,
    accuracy: d.avgScore ?? d.score ?? 0,
  }));

  // AccuracyChart expects [{ name, avgScore }]
  const perQuizData = (data?.perQuiz ?? []).map((q) => ({
    name: q.title ?? q.name,
    avgScore: q.avgScore ?? q.score ?? 0,
  }));

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">Track student performance and quiz engagement</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard title="Total Attempts" value={data?.totalAttempts ?? 0} icon={BarChart3} />
        <StatCard title="Active Students" value={data?.activeStudents ?? 0} icon={Users} />
        <StatCard title="Avg Accuracy" value={`${data?.avgAccuracy ?? 0}%`} icon={TrendingUp}
          trend="up" subtitle="across all quizzes" />
        <StatCard title="Perfect Scores" value={data?.perfectScores ?? 0} icon={Award} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ScoreChart data={scoreTrendData} />
        <AccuracyChart data={perQuizData} />
      </div>

      {(data?.topStudents ?? []).length > 0 && (
        <div className="bg-card rounded-2xl p-6"
          style={{ border: "1px solid hsl(var(--border))", boxShadow: "var(--shadow-sm)" }}>
          <h3 className="font-semibold text-foreground mb-4">Top Students</h3>
          <div className="space-y-2">
            {data.topStudents.map((s, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 px-4 rounded-xl bg-muted/30">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium text-foreground">{s.name}</span>
                </div>
                <div className="flex items-center gap-5">
                  <span className="text-xs text-muted-foreground">{s.attempts} attempts</span>
                  <span className={`text-sm font-bold ${
                    s.avgScore >= 80 ? "text-success" : s.avgScore >= 60 ? "text-warning" : "text-destructive"
                  }`}>{s.avgScore}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}