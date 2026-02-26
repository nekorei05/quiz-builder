import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Save } from "lucide-react";
import { useQuiz } from "@/context/QuizContext";
import { useToast } from "@/hooks/useToast";
import QuizForm from "@/components/quiz/QuizForm";
import QuestionEditor from "@/components/quiz/QuestionEditor";

const EMPTY_QUESTION = {
  text: "",
  options: ["", "", "", ""],
  correctAnswer: 0,
};

export default function CreateQuiz({
  initialData = null,
  isEditing = false,
}) {
  const navigate = useNavigate();
  const { createQuiz, updateQuiz } = useQuiz();
  const { error: toastError, success: toastSuccess } = useToast();

  const [title, setTitle] = useState(
    initialData?.title ?? ""
  );

  const [description, setDescription] = useState(
    initialData?.description ?? ""
  );

  const [difficulty, setDifficulty] = useState(
    initialData?.difficulty ?? "medium"
  );

  const [timeLimit, setTimeLimit] = useState(
    initialData?.timeLimit ?? 15
  );

  const [questions, setQuestions] = useState(() => {
    if (initialData?.questions?.length) {
      return initialData.questions;
    }
    return [EMPTY_QUESTION];
  });

  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { ...EMPTY_QUESTION },
    ]);
  };

  const handleUpdateQuestion = (
    questionIndex,
    field,
    value
  ) => {
    setQuestions((prev) =>
      prev.map((question, index) => {
        if (index !== questionIndex) {
          return question;
        }

        return {
          ...question,
          [field]: value,
        };
      })
    );
  };

  const handleUpdateOption = (
    questionIndex,
    optionIndex,
    value
  ) => {
    setQuestions((prev) =>
      prev.map((question, index) => {
        if (index !== questionIndex) {
          return question;
        }

        const options = [...question.options];
        options[optionIndex] = value;

        return {
          ...question,
          options,
        };
      })
    );
  };

  const handleRemoveQuestion = (questionIndex) => {
    setQuestions((prev) =>
      prev.filter(
        (_, index) => index !== questionIndex
      )
    );
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toastError("Quiz title is required");
      return;
    }

    const hasEmptyQuestion = questions.some(
      (question) => !question.text.trim()
    );

    if (hasEmptyQuestion) {
      toastError(
        "All questions must have text"
      );
      return;
    }

    const quizData = {
      title: title.trim(),
      description: description.trim(),
      difficulty,
      timeLimit,
      questions,
    };

    if (isEditing) {
      updateQuiz(initialData.id, quizData);
      toastSuccess("Quiz updated");
    } else {
     await createQuiz(quizData);
toastSuccess("Quiz created");
    }
navigate("/admin/quizzes");
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isEditing
              ? "Edit Quiz"
              : "Create Quiz"}
          </h1>

          <p className="text-muted-foreground mt-1">
            Add questions and configure quiz settings
          </p>
        </div>

        <button
          onClick={handleBack}
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
        {questions.map(
          (question, index) => (
            <QuestionEditor
              key={index}
              index={index}
              question={question}
              onUpdate={(
                field,
                value
              ) =>
                handleUpdateQuestion(
                  index,
                  field,
                  value
                )
              }
              onUpdateOption={(
                optionIndex,
                value
              ) =>
                handleUpdateOption(
                  index,
                  optionIndex,
                  value
                )
              }
              onRemove={() =>
                handleRemoveQuestion(index)
              }
              canRemove={
                questions.length > 1
              }
            />
          )
        )}
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
          {isEditing
            ? "Update Quiz"
            : "Create Quiz"}
        </button>
      </div>
    </div>
  );
}