import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Save } from "lucide-react";
import { useQuiz } from "@/context/QuizContext";
import { useToast } from "@/hooks/useToast";
import QuizForm from "@/components/quiz/QuizForm";
import QuestionEditor from "@/components/quiz/QuestionEditor";

const EMPTY_QUESTION = {
  questionText: "",       // ✅ matches backend field name
  options: ["", "", "", ""],
  correctAnswer: 0,
};

export default function CreateQuiz({ initialData = null, isEditing = false }) {
  const navigate = useNavigate();
  const { createQuiz, updateQuiz } = useQuiz();
  const { error: toastError, success: toastSuccess } = useToast();

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [difficulty, setDifficulty] = useState(initialData?.difficultyLevel ?? "medium");
  const [timeLimit, setTimeLimit] = useState(initialData?.timeLimit ?? 15);

  const [questions, setQuestions] = useState(() => {
    if (initialData?.questions?.length) return initialData.questions;
    return [{ ...EMPTY_QUESTION }];
  });

  const handleAddQuestion = () => {
    setQuestions((prev) => [...prev, { ...EMPTY_QUESTION }]);
  };

  const handleUpdateQuestion = (questionIndex, field, value) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i !== questionIndex ? q : { ...q, [field]: value }))
    );
  };

  const handleUpdateOption = (questionIndex, optionIndex, value) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== questionIndex) return q;
        const options = [...q.options];
        options[optionIndex] = value;
        return { ...q, options };
      })
    );
  };

  const handleRemoveQuestion = (questionIndex) => {
    setQuestions((prev) => prev.filter((_, i) => i !== questionIndex));
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toastError("Quiz title is required");
      return;
    }

    const hasEmptyQuestion = questions.some((q) => !q.questionText?.trim());
    if (hasEmptyQuestion) {
      toastError("All questions must have text");
      return;
    }

    // ✅ Field names match exactly what backend expects
    const quizData = {
      title: title.trim(),
      description: description.trim(),
      difficultyLevel: difficulty,       // ✅ was: difficulty
      timeLimit,
      totalMarks: questions.length * 10,
      questions: questions.map((q) => ({
        questionText: q.questionText,    // ✅ was: q.text
        options: q.options,
        correctAnswer: q.correctAnswer,
        difficulty: difficulty,
      })),
    };

    try {
      if (isEditing) {
        await updateQuiz(initialData._id || initialData.id, quizData);
        toastSuccess("Quiz updated");
      } else {
        await createQuiz(quizData);
        toastSuccess("Quiz created successfully!");
      }
      navigate("/admin/quizzes");
    } catch (err) {
      toastError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isEditing ? "Edit Quiz" : "Create Quiz"}
          </h1>
          <p className="text-muted-foreground mt-1">
            Add questions and configure quiz settings
          </p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      <QuizForm
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        timeLimit={timeLimit}
        setTimeLimit={setTimeLimit}
      />

      <div className="mt-6 space-y-4">
        {questions.map((question, index) => (
          <QuestionEditor
            key={index}
            index={index}
            question={question}
            onUpdate={(field, value) => handleUpdateQuestion(index, field, value)}
            onUpdateOption={(optionIndex, value) => handleUpdateOption(index, optionIndex, value)}
            onRemove={() => handleRemoveQuestion(index)}
            canRemove={questions.length > 1}
          />
        ))}
      </div>

      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={handleAddQuestion}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Question
        </button>

        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Save className="w-4 h-4" />
          {isEditing ? "Update Quiz" : "Create Quiz"}
        </button>
      </div>
    </div>
  );
}