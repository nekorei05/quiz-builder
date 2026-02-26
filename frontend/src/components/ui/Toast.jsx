import { X } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/utils/helpers";

const typeStyles = {
  default: "bg-card border-border",
  success: "bg-success/10 border-success text-success",
  error: "bg-destructive/10 border-destructive text-destructive",
  warning: "bg-warning/10 border-warning text-warning",
  info: "bg-primary/10 border-primary text-primary",
};

export default function Toast() {
  const { toasts, dismiss } = useToast();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm">
      {toasts.map((t) => {
        const style = typeStyles[t.type] || typeStyles.default;

        return (
          <div
            key={t.id}
            className={cn(
              "rounded-lg p-4 shadow-lg animate-fade-in border",
              style
            )}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1">
                {t.title && (
                  <p className="text-sm font-medium">
                    {t.title}
                  </p>
                )}

                {t.description && (
                  <p className="text-xs opacity-80 mt-1">
                    {t.description}
                  </p>
                )}
              </div>

              <button
                onClick={() => dismiss(t.id)}
                className="p-1 rounded hover:bg-black/10"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}