import { cn } from "@/utils/helpers";

export default function ProgressBar({
  value = 0,
  max = 100,
  className,
}) {
  const percentage =
    max > 0
      ? Math.min(100, Math.max(0, (value / max) * 100))
      : 0;

  return (
    <div
      className={cn(
        "w-full h-1.5 bg-muted rounded-full overflow-hidden",
        className
      )}
    >
      <div
        className="h-full bg-primary transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}