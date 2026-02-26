import { Clock } from "lucide-react";
import { formatTime } from "@/utils/helpers";

const QuizTimer = ({ timeLeft = 0 }) => {

  const safeTime = Math.max(0, Number(timeLeft) || 0);
  const isCritical = safeTime <= 60;

  return (
    <div
      className={`
        flex items-center gap-1.5 px-3 py-1.5 rounded-lg
        text-sm font-mono font-medium transition-colors

        ${isCritical
          ? "bg-destructive/10 text-destructive"
          : "bg-muted text-foreground"
        }
      `}
    >
      <Clock className="w-3.5 h-3.5" />

      <span>
        {formatTime ? formatTime(safeTime) : `${safeTime}s`}
      </span>

    </div>
  );
};

export default QuizTimer;