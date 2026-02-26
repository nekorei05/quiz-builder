import { useParams, useNavigate } from "react-router-dom";
import { useQuiz } from "@/context/QuizContext";
import CreateQuiz from "./CreateQuiz";

export default function EditQuiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { quizzes } = useQuiz();

  const quiz = quizzes.find(
    (item) => String(item.id) === String(quizId)
  );

  const handleBack = () => {
    navigate("/admin/quizzes");
  };

  if (!quiz) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <div
          className="bg-card rounded-2xl p-10 text-center"
          style={{ border: "1px solid hsl(var(--border))" }}
        >
          <p className="text-lg font-semibold text-foreground mb-2">
            Quiz not found
          </p>

          <p className="text-sm text-muted-foreground mb-6">
            This quiz may have been deleted or the link is invalid.
          </p>

          <button
            onClick={handleBack}
            className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition"
          >
            Back to My Quizzes
          </button>
        </div>
      </div>
    );
  }

  return (
    <CreateQuiz
      initialData={quiz}
      isEditing
    />
  );
}