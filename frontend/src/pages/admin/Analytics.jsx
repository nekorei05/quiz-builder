// import { useMemo } from "react";
// import { BarChart3, Users, TrendingUp, Award } from "lucide-react";
// import { useQuiz } from "@/context/QuizContext";
// import ScoreChart from "@/components/analytics/ScoreChart";
// import AccuracyChart from "@/components/analytics/AccuracyChart";

// const FALLBACK_TREND = [
//   { name: "Week 1", score: 65, accuracy: 60 },
//   { name: "Week 2", score: 70, accuracy: 68 }
// ];

// const FALLBACK_STUDENTS = [
//   { name: "Alice", avgScore: 88 },
//   { name: "Bob", avgScore: 72 }
// ];

// function StatCard({ title, value, icon: Icon, subtitle, trend }) {
//   const trendColor =
//     trend === "up"
//       ? "text-success"
//       : trend === "down"
//       ? "text-destructive"
//       : "text-muted-foreground";

//   return (
//     <div
//       className="bg-card rounded-2xl p-5 flex items-start justify-between"
//       style={{
//         border: "1px solid hsl(var(--border))",
//         boxShadow: "var(--shadow-sm)",
//       }}
//     >
//       <div>
//         <p className="text-sm text-muted-foreground">{title}</p>
//         <p className="text-3xl font-bold text-foreground mt-1">
//           {value ?? 0}
//         </p>

//         {subtitle && (
//           <p className={`text-xs mt-1 ${trendColor}`}>
//             {subtitle}
//           </p>
//         )}
//       </div>

//       {Icon && (
//         <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
//           <Icon className="w-5 h-5 text-primary" />
//         </div>
//       )}
//     </div>
//   );
// }

// export default function Analytics() {
//   const { attempts } = useQuiz();

//   const totalAttempts = attempts.length;

//   const activeStudents = useMemo(() => {
//     const uniqueIds = new Set(attempts.map((attempt) => attempt.userId));
//     return uniqueIds.size;
//   }, [attempts]);

//   const avgAccuracy = useMemo(() => {
//     if (attempts.length === 0) return 0;

//     const totalAccuracy = attempts.reduce((sum, attempt) => {
//       const total =
//         attempt.total ??
//         attempt.totalQuestions ??
//         1;

//       return sum + (attempt.score / total) * 100;
//     }, 0);

//     return Math.round(totalAccuracy / attempts.length);
//   }, [attempts]);

//   const perfectScores = useMemo(() => {
//     return attempts.filter((attempt) => {
//       const total =
//         attempt.total ??
//         attempt.totalQuestions ??
//         1;

//       return attempt.score === total;
//     }).length;
//   }, [attempts]);

//   const scoreTrendData = useMemo(() => {
//     if (attempts.length === 0) {
//       return FALLBACK_TREND;
//     }

//     return attempts.map((attempt, index) => {
//       const total =
//         attempt.total ??
//         attempt.totalQuestions ??
//         1;

//       const percentage = Math.round(
//         (attempt.score / total) * 100
//       );

//       return {
//         name: `Week ${index + 1}`,
//         score: percentage,
//         accuracy: percentage,
//       };
//     });
//   }, [attempts]);

//   const studentScoreData = useMemo(() => {
//     if (attempts.length === 0) {
//       return FALLBACK_STUDENTS;
//     }

//     const studentMap = {};

//     attempts.forEach((attempt) => {
//       const name =
//         attempt.userName ||
//         String(attempt.userId) ||
//         "Unknown";

//       if (!studentMap[name]) {
//         studentMap[name] = {
//           name,
//           total: 0,
//           count: 0,
//         };
//       }

//       const total =
//         attempt.total ??
//         attempt.totalQuestions ??
//         1;

//       studentMap[name].total +=
//         (attempt.score / total) * 100;

//       studentMap[name].count += 1;
//     });

//     return Object.values(studentMap).map((student) => ({
//       name: student.name,
//       avgScore: Math.round(
//         student.total / student.count
//       ),
//     }));
//   }, [attempts]);

//   return (
//     <div className="p-8 max-w-7xl mx-auto">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-foreground">
//           Analytics
//         </h1>
//         <p className="text-muted-foreground mt-1">
//           Track student performance and quiz engagement
//         </p>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
//         <StatCard
//           title="Total Attempts"
//           value={totalAttempts}
//           icon={BarChart3}
//         />

//         <StatCard
//           title="Active Students"
//           value={activeStudents}
//           icon={Users}
//         />

//         <StatCard
//           title="Avg Accuracy"
//           value={`${avgAccuracy}%`}
//           icon={TrendingUp}
//           trend="up"
//           subtitle="+3% this week"
//         />

//         <StatCard
//           title="Perfect Scores"
//           value={perfectScores}
//           icon={Award}
//         />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <ScoreChart data={scoreTrendData} />
//         <AccuracyChart data={studentScoreData} />
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { BarChart3, Users, TrendingUp, Award } from "lucide-react";
import { getAdminAnalytics } from "@/services/analyticsService";
import ScoreChart from "@/components/analytics/ScoreChart";
import AccuracyChart from "@/components/analytics/AccuracyChart";

function StatCard({ title, value, icon: Icon, subtitle, trend }) {
  const trendColor = trend === "up" ? "text-success" : trend === "down" ? "text-destructive" : "text-muted-foreground";
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
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <p className="text-destructive text-sm">Failed to load analytics: {error}</p>
      </div>
    );
  }

  const isEmpty = !data || data.totalAttempts === 0;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">Track student performance and quiz engagement</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard title="Total Attempts" value={data.totalAttempts} icon={BarChart3} />
        <StatCard title="Active Students" value={data.activeStudents} icon={Users} />
        <StatCard title="Avg Accuracy" value={`${data.avgAccuracy}%`} icon={TrendingUp} trend="up" />
        <StatCard title="Perfect Scores" value={data.perfectScores} icon={Award} />
      </div>

      {isEmpty ? (
        <div className="bg-card rounded-2xl p-16 text-center"
          style={{ border: "1px solid hsl(var(--border))" }}>
          <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-semibold text-foreground">No data yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Analytics will appear once students start attempting quizzes
          </p>
        </div>
      ) : (
        <>
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <ScoreChart data={data.scoreTrend} />
            <AccuracyChart data={data.perQuiz} />
          </div>

          {/* Top Students Table */}
          <div className="bg-card rounded-2xl overflow-hidden"
            style={{ border: "1px solid hsl(var(--border))", boxShadow: "var(--shadow-sm)" }}>
            <div className="px-6 py-4" style={{ borderBottom: "1px solid hsl(var(--border))" }}>
              <h3 className="font-semibold text-foreground">Top Students</h3>
            </div>
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid hsl(var(--border))" }}>
                  {["Student", "Attempts", "Avg Score"].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-muted-foreground px-6 py-3 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.topStudents.map((student, i) => (
                  <tr key={i} className="hover:bg-muted/30 transition-colors"
                    style={i < data.topStudents.length - 1 ? { borderBottom: "1px solid hsl(var(--border))" } : undefined}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                          {student.name[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{student.name}</p>
                          {student.email && <p className="text-xs text-muted-foreground">{student.email}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{student.attempts}</td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-semibold ${
                        student.avgScore >= 80 ? "text-success" :
                        student.avgScore >= 60 ? "text-warning" : "text-destructive"
                      }`}>
                        {student.avgScore}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}