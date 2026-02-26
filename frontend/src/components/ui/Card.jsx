import { cn } from "@/utils/helpers";

export default function Card({
  className,
  children,
  ...props
}) {
  return (
    <div
      className={cn(
        "glass-card p-5 rounded-xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}