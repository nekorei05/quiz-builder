import { Clock, HelpCircle, ArrowRight } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { DIFFICULTY_COLORS } from "@/utils/constants";

const QuizCard = ({
  title = "Untitled Quiz",
  description = "",
  subject = "General",
  difficulty = "medium",
  timeLimit = 0,
  questionCount = 0,
  status,
  onAction,
  actionLabel = "Start Quiz",
}) => {
  let difficultyColor = "bg-muted text-muted-foreground border-border";

  if (DIFFICULTY_COLORS && DIFFICULTY_COLORS[difficulty]) {
    difficultyColor = DIFFICULTY_COLORS[difficulty];
  }

  const showDescription = Boolean(description);
  const showStatus = Boolean(status);
  const showAction = typeof onAction === "function";

  const handleActionClick = () => {
    if (showAction) {
      onAction();
    }
  };

  return (
    <div className="glass-card p-5 flex flex-col gap-3 hover:shadow-lg transition-shadow">

      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-sm">
            {title}
          </h3>

          <p className="text-xs text-muted-foreground mt-0.5">
            {subject}
          </p>
        </div>

        <div className="flex gap-1.5">
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${difficultyColor}`}
          >
            {difficulty}
          </span>

          {showStatus && (
            <Badge
              variant={
                status === "published"
                  ? "default"
                  : "secondary"
              }
            >
              {status}
            </Badge>
          )}
        </div>
      </div>

      {showDescription && (
        <p className="text-xs text-muted-foreground line-clamp-2">
          {description}
        </p>
      )}

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {timeLimit} min
        </span>

        <span className="flex items-center gap-1">
          <HelpCircle className="w-3 h-3" />
          {questionCount} questions
        </span>
      </div>

      {showAction && (
        <Button
          size="sm"
          type="button"
          onClick={handleActionClick}
          className="mt-auto w-full gap-2"
        >
          {actionLabel}
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      )}

    </div>
  );
};

export default QuizCard;