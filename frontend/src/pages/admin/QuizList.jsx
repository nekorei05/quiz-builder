import { useNavigate } from "react-router-dom";
import { Plus, Clock, HelpCircle, ArrowRight } from "lucide-react";
import { useQuiz } from "@/context/QuizContext";

export default function QuizList() {
  const navigate = useNavigate();
  const { quizzes } = useQuiz();

  const handleCreate = () => {
    navigate("/admin/create");
  };

  const handleEdit = (id) => {
    navigate(`/admin/quizzes/edit/${id}`);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Quizzes</h1>
          <p className="text-muted-foreground mt-1">Manage all your quizzes</p>
        </div>

        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl hover:bg-primary/90 transition font-medium"
        >
          <Plus className="w-4 h-4" />
          New Quiz
        </button>
      </div>

      {quizzes.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg font-medium">No quizzes yet</p>
          <p className="text-sm mt-1">Create your first quiz to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {quizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              onEdit={() => handleEdit(quiz.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function QuizCard({ quiz, onEdit }) {
  const difficulty = quiz.difficulty || "easy";

  let difficultyStyle = "bg-muted text-muted-foreground border-border";

  if (difficulty === "easy") {
    difficultyStyle = "bg-primary/10 text-primary border-primary/20";
  } else if (difficulty === "medium") {
    difficultyStyle = "bg-warning/10 text-warning border-warning/20";
  } else if (difficulty === "hard") {
    difficultyStyle = "bg-destructive/10 text-destructive border-destructive/20";
  }

  const statusStyle =
    quiz.status === "published"
      ? "bg-primary/10 text-primary border-primary/20"
      : "bg-muted text-muted-foreground border-border";

  const questionCount = quiz.questions ? quiz.questions.length : 0;
  const timeLimit = quiz.timeLimit || 10;

  return (
    <div
      className="bg-card rounded-2xl p-6 flex flex-col gap-3"
      style={{
        border: "1px solid hsl(var(--border))",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-foreground">{quiz.title}</h3>

        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          <span
            className={`text-[11px] px-2.5 py-0.5 rounded-full border font-medium ${difficultyStyle}`}
          >
            {difficulty}
          </span>

          {quiz.status && (
            <span
              className={`text-[11px] px-2.5 py-0.5 rounded-full border font-medium ${statusStyle}`}
            >
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
          {timeLimit} min
        </span>

        <span className="flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5" />
          {questionCount} questions
        </span>
      </div>

      <button
        onClick={onEdit}
        className="mt-2 w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-xl hover:bg-primary/90 transition font-medium text-sm"
      >
        Edit
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}