import { Zap } from "lucide-react";
import { DIFFICULTY_COLORS } from "@/utils/constants";

const DifficultyBadge = ({
  difficulty = "medium",
  streakCorrect = 0,
  streakWrong = 0,
}) => {
  let colorClass =
    "bg-muted text-muted-foreground border-border";

  if (
    DIFFICULTY_COLORS &&
    DIFFICULTY_COLORS[difficulty]
  ) {
    colorClass =
      DIFFICULTY_COLORS[difficulty];
  }

  const showCorrectStreak =
    streakCorrect >= 2;

  const showWrongStreak =
    streakWrong >= 2;

  return (
    <div className="flex items-center gap-2 mb-4">

      <div
        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${colorClass}`}
      >
        <Zap className="w-3 h-3" />
        Adaptive: {difficulty}
      </div>

      {showCorrectStreak && (
        <span className="text-xs text-success">
          🔥 {streakCorrect} correct streak!
        </span>
      )}

      {showWrongStreak && (
        <span className="text-xs text-destructive">
          ⚠ {streakWrong} wrong streak
        </span>
      )}

    </div>
  );
};

export default DifficultyBadge;