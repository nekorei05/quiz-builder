import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Save } from "lucide-react";
import { useQuiz } from "@/context/QuizContext";
import { useToast } from "@/hooks/useToast";
import QuizForm from "@/components/quiz/QuizForm";
import QuestionEditor from "@/components/quiz/QuestionEditor";

const EMPTY_QUESTION = {
  questionText: "",
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
  const [timeLimit, setTimeLimit] = useState(initialData?.timeLimit ?? "");
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? false); 
  const [questions, setQuestions] = useState(() =>
    initialData?.questions?.length ? initialData.questions : [{ ...EMPTY_QUESTION }]
  );

  const handleAddQuestion = () =>
    setQuestions((prev) => [...prev, { ...EMPTY_QUESTION }]);

  const handleUpdateQuestion = (qi, field, value) =>
    setQuestions((prev) => prev.map((q, i) => (i !== qi ? q : { ...q, [field]: value })));

  const handleUpdateOption = (qi, oi, value) =>
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qi) return q;
        const options = [...q.options];
        options[oi] = value;
        return { ...q, options };
      })
    );

  const handleRemoveQuestion = (qi) =>
    setQuestions((prev) => prev.filter((_, i) => i !== qi));

  const handleSubmit = async () => {
    if (!title.trim()) return toastError("Quiz title is required");
    if (questions.some((q) => !q.questionText?.trim()))
      return toastError("All questions must have text");

    const quizData = {
      title: title.trim(),
      description: description.trim(),
      difficultyLevel: difficulty,
      timeLimit,
      totalMarks: questions.length * 10,
      isPublished,   
      questions: questions.map((q) => ({
        ...(q._id ? { _id: q._id } : {}),
        questionText: q.questionText,
        options: q.options,
        correctAnswer: Number(q.correctAnswer),
        difficulty: q.difficulty || difficulty,
      })),
    };

    try {
      if (isEditing) {
        await updateQuiz(initialData._id || initialData.id, quizData);
        toastSuccess(isPublished ? "Quiz updated & published" : "Quiz saved as draft");
      } else {
        await createQuiz(quizData);
        toastSuccess(isPublished ? "Quiz created & published!" : "Quiz saved as draft!");
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
          <p className="text-muted-foreground mt-1">Add questions and configure quiz settings</p>
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
        title={title} setTitle={setTitle}
        description={description} setDescription={setDescription}
        difficulty={difficulty} setDifficulty={setDifficulty}
        timeLimit={timeLimit} setTimeLimit={setTimeLimit}
        isPublished={isPublished} setIsPublished={setIsPublished}
      />

      <div className="mt-6 space-y-4">
        {questions.map((question, index) => (
          <QuestionEditor
            key={question._id || index}
            index={index}
            question={question}
            onUpdate={(field, value) => handleUpdateQuestion(index, field, value)}
            onUpdateOption={(oi, value) => handleUpdateOption(index, oi, value)}
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
          {isEditing ? "Update Quiz" : "Save Quiz"}
        </button>
      </div>
    </div>
  );
}