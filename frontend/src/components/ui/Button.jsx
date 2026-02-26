import { cn } from "@/utils/helpers";
import { forwardRef } from "react";

const variants = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  ghost: "hover:bg-accent hover:text-accent-foreground",
};

const sizes = {
  default: "h-10 px-4 py-2",
  sm: "h-8 px-3 text-xs",
  lg: "h-12 px-6 text-base",
  icon: "h-10 w-10",
};

const Button = forwardRef(function Button(
  {
    className,
    variant = "default",
    size = "default",
    type = "button",
    children,
    ...props
  },
  ref
) {
  const variantStyle =
    variants[variant] ||
    variants.default;

  const sizeStyle =
    sizes[size] ||
    sizes.default;

  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        variantStyle,
        sizeStyle,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

export default Button;