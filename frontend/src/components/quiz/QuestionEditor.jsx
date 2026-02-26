import { Trash2 } from "lucide-react";
import Input from "@/components/ui/Input";

const QuestionEditor = ({
  question,
  index = 0,
  onUpdate = () => {},
  onUpdateOption = () => {},
  onRemove = () => {},
  canRemove = false,
}) => {
  if (!question) {
    return null;
  }

  const text = question.text || "";
  const options = question.options || ["", "", "", ""];
  const correctAnswer =
    typeof question.correctAnswer === "number"
      ? question.correctAnswer
      : 0;
  const difficulty = question.difficulty || "medium";

  const handleDifficultyChange = (event) => {
    const value = event.target.value;
    onUpdate("difficulty", value);
  };

  const handleTextChange = (event) => {
    const value = event.target.value;
    onUpdate("text", value);
  };

  const handleCorrectChange = (optionIndex) => {
    onUpdate("correctAnswer", optionIndex);
  };

  const handleOptionChange = (optionIndex, event) => {
    const value = event.target.value;
    onUpdateOption(optionIndex, value);
  };

  const handleRemoveClick = () => {
    onRemove();
  };

  return (
    <div
      className="bg-card rounded-2xl p-6 space-y-4"
      style={{
        border: "1px solid hsl(var(--border))",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-foreground">
          Question {index + 1}
        </h3>

        <div className="flex items-center gap-2">
          <select
            value={difficulty}
            onChange={handleDifficultyChange}
            className="h-8 rounded-lg border bg-background px-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          {canRemove && (
            <button
              type="button"
              onClick={handleRemoveClick}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <Input
        placeholder="Question text"
        value={text}
        onChange={handleTextChange}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((option, optionIndex) => {
          const isSelected =
            correctAnswer === optionIndex;

          return (
            <div
              key={optionIndex}
              className="flex items-center gap-2.5"
            >
              <input
                type="radio"
                name={`correct-${index}`}
                checked={isSelected}
                onChange={() =>
                  handleCorrectChange(optionIndex)
                }
                className="accent-primary cursor-pointer w-4 h-4 shrink-0"
              />

              <Input
                placeholder={`Option ${optionIndex + 1}`}
                value={option || ""}
                onChange={(event) =>
                  handleOptionChange(optionIndex, event)
                }
                className="flex-1"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionEditor;