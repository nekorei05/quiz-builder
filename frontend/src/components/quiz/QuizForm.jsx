import Input from "@/components/ui/Input";

const QuizForm = ({
  title = "",
  setTitle,
  description = "",
  setDescription,
  difficulty = "medium",
  setDifficulty,
  timeLimit = 15,
  setTimeLimit,
}) => {
  const handleTitleChange = (e) => {
    if (setTitle) {
      setTitle(e.target.value);
    }
  };

  const handleDescriptionChange = (e) => {
    if (setDescription) {
      setDescription(e.target.value);
    }
  };

  const handleDifficultyChange = (e) => {
    if (setDifficulty) {
      setDifficulty(e.target.value);
    }
  };

  const handleTimeChange = (e) => {
    const value = parseInt(e.target.value, 10);

    if (setTimeLimit) {
      if (!isNaN(value) && value >= 1) {
        setTimeLimit(value);
      } else {
        setTimeLimit(1);
      }
    }
  };

  return (
    <div
      className="bg-card rounded-2xl p-6 space-y-4"
      style={{
        border: "1px solid hsl(var(--border))",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <h2 className="text-base font-semibold text-foreground">
        Quiz Details
      </h2>

      <Input
        placeholder="Quiz title"
        value={title}
        onChange={handleTitleChange}
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={handleDescriptionChange}
        rows={3}
        className="flex w-full rounded-xl border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
        style={{
          borderColor: "hsl(var(--border))",
        }}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <select
          value={difficulty}
          onChange={handleDifficultyChange}
          className="flex h-10 w-full rounded-xl border bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          style={{
            borderColor: "hsl(var(--border))",
          }}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <Input
          type="number"
          placeholder="Time (min)"
          value={timeLimit}
          min={1}
          onChange={handleTimeChange}
        />
      </div>
    </div>
  );
};

export default QuizForm;
