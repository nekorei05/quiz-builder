import { useNavigate } from "react-router-dom";
import { Plus, Clock, HelpCircle, ArrowRight, Trash2 } from "lucide-react";
import { useQuiz } from "@/context/QuizContext";
import { quizService } from "@/services/quizService";
import { useState } from "react";

export default function QuizList() {
  const navigate = useNavigate();
  const { quizzes, setQuizzes, loading } = useQuiz();

  const [quizToDelete, setQuizToDelete] = useState(null);

  const handleDelete = async () => {
    if (!quizToDelete) return;

    try {
      await quizService.deleteQuiz(quizToDelete);

      setQuizzes(prev => prev.filter(q => q._id !== quizToDelete));

      setQuizToDelete(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Quizzes</h1>
          <p className="text-muted-foreground mt-1">Manage all your quizzes</p>
        </div>

        <button
          onClick={() => navigate("/admin/create")}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl hover:bg-primary/90 transition font-medium"
        >
          <Plus className="w-4 h-4" />
          New Quiz
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : quizzes.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg font-medium">No quizzes yet</p>
          <p className="text-sm mt-1">Create your first quiz to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {quizzes.map((quiz) => (
            <QuizCard
              key={quiz._id}
              quiz={{
                ...quiz,
                id: quiz._id,
                difficulty: quiz.difficultyLevel,
                status: quiz.isPublished ? "published" : "draft",
                questionCount: quiz.questionCount ?? 0,
              }}
              onEdit={() => navigate(`/admin/quizzes/edit/${quiz._id}`)}
              onDelete={() => setQuizToDelete(quiz._id)}
            />
          ))}
        </div>
      )}

      {/* DELETE MODAL */}
      {quizToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">

          <div className="bg-card rounded-2xl p-6 w-[320px] border border-border shadow-xl">

            <h3 className="text-lg font-semibold text-foreground mb-2">
              Delete Quiz
            </h3>

            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to delete this quiz?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setQuizToDelete(null)}
                className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </button>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}

function QuizCard({ quiz, onEdit, onDelete }) {
  const difficulty = quiz.difficulty || "easy";

  const difficultyStyles = {
    easy: "bg-primary/10 text-primary border-primary/20",
    medium: "bg-warning/10 text-warning border-warning/20",
    hard: "bg-destructive/10 text-destructive border-destructive/20",
  };

  const difficultyStyle =
    difficultyStyles[difficulty] ||
    "bg-muted text-muted-foreground border-border";

  const statusStyle =
    quiz.status === "published"
      ? "bg-primary/10 text-primary border-primary/20"
      : "bg-muted text-muted-foreground border-border";

  return (
    <div
      className="bg-card rounded-2xl p-6 flex flex-col gap-3 relative"
      style={{ border: "1px solid hsl(var(--border))", boxShadow: "var(--shadow-sm)" }}
    >

      {/* Delete button */}
      {onDelete && (
        <button
          onClick={onDelete}
          className="absolute top-4 right-4 p-1.5 rounded-md text-destructive hover:bg-destructive/10 transition"
          title="Delete Quiz"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}

      {/* Title */}
      <h3 className="font-semibold text-foreground pr-6">
        {quiz.title}
      </h3>

      {/* Description */}
      {quiz.description && (
        <p className="text-sm text-muted-foreground line-clamp-2">
          {quiz.description}
        </p>
      )}

      {/* Meta */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          {quiz.timeLimit ?? 10} min
        </span>

        <span className="flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5" />
          {quiz.questionCount} questions
        </span>
      </div>

      {/* Difficulty + Status */}
      <div className="flex items-center gap-2 mt-1">
        <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-medium ${difficultyStyle}`}>
          {difficulty}
        </span>

        {quiz.status && (
          <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-medium ${statusStyle}`}>
            {quiz.status}
          </span>
        )}
      </div>

      {/* Edit button */}
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