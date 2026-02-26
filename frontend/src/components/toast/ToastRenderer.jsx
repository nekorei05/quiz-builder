import { useToast } from "@/context/ToastContext";

const ToastRenderer = () => {
  const { toasts, remove } = useToast();

  if (!toasts.length) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">

      {toasts.map((toast) => {

        const color =
          toast.type === "success"
            ? "border-success/30 bg-success/10 text-success"
            : toast.type === "error"
            ? "border-danger/30 bg-danger/10 text-danger"
            : toast.type === "warning"
            ? "border-warning/30 bg-warning/10 text-warning"
            : "border-info/30 bg-info/10 text-info";

        return (
          <div
            key={toast.id}
            className={`
              glass-card
              p-4
              min-w-[260px]
              max-w-[320px]
              animate-fade-in
              ${color}
            `}
          >

            <div className="font-semibold text-sm">
              {toast.title}
            </div>

            {toast.description && (
              <div className="text-xs mt-1 opacity-80">
                {toast.description}
              </div>
            )}

            <button
              onClick={() => remove(toast.id)}
              className="text-xs mt-2 hover:underline"
            >
              Dismiss
            </button>

          </div>
        );
      })}
    </div>
  );
};

export default ToastRenderer;