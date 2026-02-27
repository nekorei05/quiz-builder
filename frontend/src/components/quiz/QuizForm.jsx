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
  isPublished = false,
  setIsPublished,
}) => {
  return (
    <div
      className="bg-card rounded-2xl p-6 space-y-4"
      style={{ border: "1px solid hsl(var(--border))", boxShadow: "var(--shadow-sm)" }}
    >
      <h2 className="text-base font-semibold text-foreground">Quiz Details</h2>

      <Input
        placeholder="Quiz title"
        value={title}
        onChange={(e) => setTitle?.(e.target.value)}
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription?.(e.target.value)}
        rows={3}
        className="flex w-full rounded-xl border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
        style={{ borderColor: "hsl(var(--border))" }}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <select
          value={difficulty}
          onChange={(e) => setDifficulty?.(e.target.value)}
          className="flex h-10 w-full rounded-xl border bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          style={{ borderColor: "hsl(var(--border))" }}
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
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            setTimeLimit?.(isNaN(v) || v < 1 ? 1 : v);
          }}
        />
      </div>

      {/* Publish toggle */}
      <div
        className="flex items-center justify-between p-3 rounded-xl bg-muted/40"
        style={{ border: "1px solid hsl(var(--border))" }}
      >
        <div>
          <p className="text-sm font-medium text-foreground">Publish Quiz</p>
          <p className="text-xs text-muted-foreground">
            {isPublished ? "Visible to students" : "Saved as draft — not visible to students"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsPublished?.(!isPublished)}
          className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
            isPublished ? "bg-primary" : "bg-muted-foreground/30"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
              isPublished ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default QuizForm;