import { useNavigate } from "react-router-dom";
import QuizCard from "@/components/quiz/QuizCard";
import EmptyState from "@/components/ui/EmptyState";
import { useQuiz } from "@/context/QuizContext";

const AvailableQuizzes = () => {
  const navigate = useNavigate();
  const { quizzes } = useQuiz();

  const publishedQuizzes = quizzes.filter(q => q.status === "published");

  if (!publishedQuizzes.length) {
    return (
      <EmptyState
        title="No quizzes available"
        description="Check back later for new quizzes"
      />
    );
  }

  return (
    <div className="p-8">
 
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Browse Quizzes</h1>
        <p className="text-muted-foreground mt-1">Find and attempt quizzes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {publishedQuizzes.map((quiz) => (
          <QuizCard
            key={quiz.id}
            title={quiz.title}
            description={quiz.description}
            difficulty={quiz.difficulty}
            timeLimit={quiz.timeLimit}
            questionCount={quiz.questions?.length || 0}
            onAction={() => navigate(`/student/quizzes/${quiz.id}`)}
            actionLabel="Start Quiz"
          />
        ))}
      </div>
    </div>
  );
};

export default AvailableQuizzes;
