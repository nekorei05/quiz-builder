import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "@/context/QuizContext";
import {BookOpen,Users,BarChart3,TrendingUp,Clock,HelpCircle,ArrowRight, Plus,} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { quizzes = [], attempts = [] } = useQuiz();

  const uniqueStudents = useMemo(() => {
    const ids = new Set(
      attempts.map((attempt) => attempt.userId)
    );
    return ids.size;
  }, [attempts]);

  const avgScore = useMemo(() => {
    if (attempts.length === 0) {
      return 0;
    }

    const totalPercentage = attempts.reduce(
      (sum, attempt) => {
        const total =
          attempt.total ??
          attempt.totalQuestions ??
          0;

        if (total === 0) {
          return sum;
        }

        return (
          sum +
          (attempt.score / total) * 100
        );
      },
      0
    );

    return Math.round(
      totalPercentage / attempts.length
    );
  }, [attempts]);

  const completionRate = 92;

  const topStudents = useMemo(() => {
    if (attempts.length === 0) {
      return [];
    }

    const studentMap = {};

    attempts.forEach((attempt) => {
      const id = attempt.userId;

      if (!studentMap[id]) {
        studentMap[id] = {
          name:
            attempt.userName ||
            String(id),
          email:
            attempt.userEmail || "",
          quizzes: 0,
          totalPercentage: 0,
          lastActive:
            attempt.completedAt || "",
        };
      }

      const total =
        attempt.total ??
        attempt.totalQuestions ??
        0;

      studentMap[id].quizzes += 1;

      if (total > 0) {
        studentMap[id].totalPercentage +=
          (attempt.score / total) * 100;
      }
    });

    return Object.values(studentMap)
      .map((student) => ({
        ...student,
        avgScore: Math.round(
          student.totalPercentage /
            student.quizzes
        ),
      }))
      .sort(
        (a, b) =>
          b.avgScore - a.avgScore
      )
      .slice(0, 5);
  }, [attempts]);

  const stats = [
    {
      title: "Total Quizzes",
      value: quizzes.length,
      subtitle: "+2 this month",
      icon: BookOpen,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      title: "Students",
      value: uniqueStudents,
      subtitle: "Active learners",
      icon: Users,
      iconBg: "bg-info/10",
      iconColor: "text-info",
    },
    {
      title: "Avg Score",
      value: `${avgScore}%`,
      subtitle: "+5% from last week",
      icon: BarChart3,
      iconBg: "bg-warning/10",
      iconColor: "text-warning",
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      subtitle: "Great engagement",
      icon: TrendingUp,
      iconBg: "bg-success/10",
      iconColor: "text-success",
    },
  ];

  const recentQuizzes = quizzes.slice(-4);

  const handleCreateQuiz = () => {
    navigate("/admin/create");
  };

  const handleViewQuiz = (quizId) => {
    navigate(`/admin/quizzes/edit/${quizId}`);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">

      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Dashboard
          </h1>

          <p className="text-muted-foreground mt-1">
            Overview of your quizzes and student performance
          </p>
        </div>

        <button
          onClick={handleCreateQuiz}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl hover:bg-primary/90 transition font-medium"
        >
          <Plus className="w-4 h-4" />
          New Quiz
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="bg-card rounded-2xl p-5 flex items-start justify-between"
              style={{
                border:
                  "1px solid hsl(var(--border))",
                boxShadow:
                  "var(--shadow-sm)",
              }}
            >
              <div>
                <p className="text-sm text-muted-foreground">
                  {stat.title}
                </p>

                <h3 className="text-3xl font-bold text-foreground mt-2">
                  {stat.value}
                </h3>

                <p className="text-xs text-muted-foreground mt-1">
                  {stat.subtitle}
                </p>
              </div>

              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.iconBg}`}
              >
                <Icon
                  className={`w-5 h-5 ${stat.iconColor}`}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mb-10">
        <h2 className="text-xl font-semibold text-foreground mb-5">
          Recent Quizzes
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {recentQuizzes.length === 0 ? (
            <p className="text-muted-foreground col-span-2 py-8 text-center">
              No quizzes yet. Create your first quiz!
            </p>
          ) : (
            recentQuizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                onView={() =>
                  handleViewQuiz(quiz.id)
                }
              />
            ))
          )}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-foreground mb-5">
          Top Students
        </h2>

        <div
          className="bg-card rounded-2xl overflow-hidden"
          style={{
            border:
              "1px solid hsl(var(--border))",
            boxShadow:
              "var(--shadow-sm)",
          }}
        >
          <table className="w-full">
            <thead>
              <tr
                style={{
                  borderBottom:
                    "1px solid hsl(var(--border))",
                }}
              >
                {[
                  "Name",
                  "Quizzes",
                  "Avg Score",
                  "Last Active",
                ].map((header) => (
                  <th
                    key={header}
                    className="text-left text-xs font-medium text-muted-foreground px-6 py-3 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {topStudents.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center text-muted-foreground py-10 text-sm"
                  >
                    No student attempts yet.
                  </td>
                </tr>
              ) : (
                topStudents.map(
                  (student, index) => (
                    <StudentRow
                      key={index}
                      student={student}
                      isLast={
                        index ===
                        topStudents.length - 1
                      }
                    />
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StudentRow({
  student,
  isLast,
}) {
  const initial =
    String(student.name)[0]?.toUpperCase() ||
    "?";

  return (
    <tr
      className="hover:bg-muted/30 transition-colors"
      style={
        isLast
          ? undefined
          : {
              borderBottom:
                "1px solid hsl(var(--border))",
            }
      }
    >
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
            {initial}
          </div>

          <div>
            <p className="text-sm font-medium text-foreground">
              {student.name}
            </p>

            {student.email && (
              <p className="text-xs text-muted-foreground">
                {student.email}
              </p>
            )}
          </div>
        </div>
      </td>

      <td className="px-6 py-4 text-sm text-muted-foreground">
        {student.quizzes}
      </td>

      <td className="px-6 py-4 text-sm font-semibold text-foreground">
        {student.avgScore}%
      </td>

      <td className="px-6 py-4 text-sm text-muted-foreground">
        {student.lastActive
          ? new Date(
              student.lastActive
            ).toLocaleDateString()
          : "—"}
      </td>
    </tr>
  );
}

function QuizCard({ quiz, onView }) {
  const difficulty =
    quiz.difficulty || "easy";

  const difficultyStyles = {
    easy:
      "bg-primary/10 text-primary border-primary/20",
    medium:
      "bg-warning/10 text-warning border-warning/20",
    hard:
      "bg-destructive/10 text-destructive border-destructive/20",
  };

  const difficultyClass =
    difficultyStyles[difficulty] ||
    "bg-muted text-muted-foreground border-border";

  return (
    <div
      className="bg-card rounded-2xl p-6 flex flex-col gap-3"
      style={{
        border:
          "1px solid hsl(var(--border))",
        boxShadow:
          "var(--shadow-sm)",
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-foreground">
          {quiz.title}
        </h3>

        <div className="flex items-center gap-1.5 shrink-0">
          <span
            className={`text-[11px] px-2.5 py-0.5 rounded-full border font-medium ${difficultyClass}`}
          >
            {difficulty}
          </span>

          {quiz.status && (
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
              {quiz.status}
            </span>
          )}
        </div>
      </div>

      {quiz.description && (
        <p className="text-sm text-muted-foreground line-clamp-2">
          {quiz.description}
        </p>
      )}

      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          {quiz.timeLimit ?? 10} min
        </span>

        <span className="flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5" />
          {quiz.questions?.length ??
            0}{" "}
          questions
        </span>
      </div>

      <button
        onClick={onView}
        className="mt-2 w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-xl hover:bg-primary/90 transition font-medium text-sm"
      >
        View Details
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}