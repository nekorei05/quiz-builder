import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuizById } from "@/services/quizService";
import CreateQuiz from "./CreateQuiz";

export default function EditQuiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await getQuizById(quizId); // returns { quiz, questions }
        // Merge questions into quiz object so CreateQuiz can prefill them
        setQuiz({
          ...data.quiz,
          questions: data.questions.map((q) => ({
            ...q,
            questionText: q.questionText,
            options: q.options,
            correctAnswer: q.correctAnswer,
            difficulty: q.difficulty,
          })),
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !quiz) {
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
            {error || "This quiz may have been deleted or the link is invalid."}
          </p>
          <button
            onClick={() => navigate("/admin/quizzes")}
            className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition"
          >
            Back to My Quizzes
          </button>
        </div>
      </div>
    );
  }

  return <CreateQuiz initialData={quiz} isEditing />;
}