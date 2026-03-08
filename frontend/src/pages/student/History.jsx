import { useState, useEffect } from "react";
import { Award, BookOpen, TrendingUp, Zap } from "lucide-react";
import ProgressChart from "@/components/analytics/ProgressChart";
import AccuracyChart from "@/components/analytics/AccuracyChart";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function StatCard({ title, value, icon: Icon, subtitle, positive }) {
  return (
    <div
      className="bg-card rounded-2xl p-5 flex items-start justify-between"
      style={{ border: "1px solid hsl(var(--border))", boxShadow: "var(--shadow-sm)" }}
    >
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
        {subtitle && (
          <p className={`text-xs mt-1 ${
            positive === true ? "text-success" : positive === false ? "text-destructive" : "text-muted-foreground"
          }`}>{subtitle}</p>
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

export default function StudentAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${BASE_URL}/analytics/student`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
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

  const isEmpty = !data || data.totalAttempts === 0;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">My Analytics</h1>
        <p className="text-muted-foreground mt-1">Track your learning progress</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard title="Avg Score" value={`${data?.avgScore ?? 0}%`} icon={Award}
          subtitle={(data?.avgScore ?? 0) >= 70 ? "Above average" : "Keep practicing!"}
          positive={(data?.avgScore ?? 0) >= 70} />
        <StatCard title="Total Attempts" value={data?.totalAttempts ?? 0} icon={Zap}
          subtitle={`${data?.uniqueQuizzes ?? 0} unique quizzes`} />
        <StatCard
          title="Improvement"
          value={`${(data?.improvement ?? 0) >= 0 ? "+" : ""}${data?.improvement ?? 0}%`}
          icon={TrendingUp}
          subtitle="first vs latest attempt"
          positive={(data?.improvement ?? 0) > 0} />
        <StatCard title="Quizzes Completed" value={data?.uniqueQuizzes ?? 0} icon={BookOpen}
          subtitle={`${data?.totalAttempts ?? 0} total attempts`} />
      </div>

      {isEmpty ? (
        <div className="bg-card rounded-2xl p-16 text-center"
          style={{ border: "1px solid hsl(var(--border))" }}>
          <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-semibold text-foreground">No data yet</p>
          <p className="text-sm text-muted-foreground mt-1">Complete quizzes to see your analytics here</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* ProgressChart expects [{ name, score }] */}
          <ProgressChart data={data.scoreTrend} />

          {/* AccuracyChart expects [{ name, avgScore }] */}
          <AccuracyChart data={data.perQuiz.map((q) => ({ name: q.name, avgScore: q.score }))} />

          <div className="bg-card rounded-2xl p-6"
            style={{ border: "1px solid hsl(var(--border))", boxShadow: "var(--shadow-sm)" }}>
            <h3 className="font-semibold text-foreground mb-4">Quiz Breakdown</h3>
            <div className="space-y-2">
              {data.perQuiz.map((q, i) => (
                <div key={i} className="flex items-center justify-between py-3 px-4 rounded-xl bg-muted/30">
                  <span className="text-sm text-foreground font-medium">{q.name}</span>
                  <div className="flex items-center gap-5">
                    <span className="text-xs text-muted-foreground">
                      {q.attempts} attempt{q.attempts !== 1 ? "s" : ""}
                    </span>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${
                        q.score >= 80 ? "text-success" : q.score >= 60 ? "text-warning" : "text-destructive"
                      }`}>{q.score}%</p>
                      <p className="text-xs text-muted-foreground">best</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}