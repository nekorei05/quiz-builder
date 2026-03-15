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
  const difficultyColor =
    DIFFICULTY_COLORS?.[difficulty] ||
    "bg-muted text-muted-foreground border-border";

  const showDescription = Boolean(description);
  const showStatus = Boolean(status);
  const showAction = typeof onAction === "function";

  return (
    <div className="glass-card p-5 flex flex-col gap-4 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-base text-foreground">
            {title}
          </h3>

          <p className="text-xs text-muted-foreground mt-0.5">
            {subject}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-[11px] px-2 py-0.5 rounded-full border font-medium capitalize ${difficultyColor}`}
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
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
      )}

      <div className="flex items-center justify-between text-sm bg-muted/40 px-3 py-2 rounded-lg">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <HelpCircle className="w-4 h-4" />
          {questionCount} Questions
        </span>

        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="w-4 h-4" />
          {timeLimit ? `${timeLimit} Min` : "No Timer"}
        </span>
      </div>

      {showAction && (
        <Button
          size="sm"
          type="button"
          onClick={onAction}
          className="mt-auto w-full gap-2"
        >
          {actionLabel}
          <ArrowRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default QuizCard;