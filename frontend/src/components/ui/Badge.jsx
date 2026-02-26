import { cn } from "@/utils/helpers";

const variantStyles = {
  default: "bg-primary/10 text-primary border-primary/20",
  secondary: "bg-secondary text-secondary-foreground border-secondary",
  destructive: "bg-destructive/10 text-destructive border-destructive/20",
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/10 text-warning border-warning/20",
};

export default function Badge({
  className,
  variant = "default",
  children,
  ...props
}) {
  const styles =
    variantStyles[variant] ||
    variantStyles.default;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium",
        styles,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}