const DIFF_STYLE = {
  easy: "bg-primary/10 text-primary border-primary/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  hard: "bg-destructive/10 text-destructive border-destructive/20",
};

const OPTION_LABELS = ["A", "B", "C", "D", "E"];

export default function QuestionCard({ question, selectedAnswer = null, onSelect = () => {} }) {
  if (!question) return null;

  // ✅ Backend returns questionText, fallback to text for any local/mock data
  const text = question.questionText || question.text || "Untitled question";
  const options = Array.isArray(question.options) ? question.options : [];
  const difficulty = question.difficulty || "medium";
  const diffStyle = DIFF_STYLE[difficulty] || "bg-muted text-muted-foreground border-border";

  return (
    <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
      <div className="flex items-start justify-between gap-4 mb-5">
        <p className="text-base font-medium text-foreground leading-relaxed">{text}</p>
        <span className={`shrink-0 text-[11px] px-2.5 py-0.5 rounded-full border font-medium ${diffStyle}`}>
          {difficulty}
        </span>
      </div>

      <div className="space-y-2.5">
        {options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          return (
            <button
              key={index}
              type="button"
              onClick={() => onSelect(index)}
              className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl border text-sm transition-all ${
                isSelected
                  ? "border-primary bg-primary/10 text-foreground font-medium"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-muted/40"
              }`}
            >
              <span
                className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold shrink-0 border ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground"
                }`}
              >
                {OPTION_LABELS[index] ?? index + 1}
              </span>
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}