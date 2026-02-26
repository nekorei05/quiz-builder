import {createContext,useContext,useState, useCallback,useMemo,} from "react";

const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);

  if (!ctx)
    throw new Error("useToast must be used inside ToastProvider");

  return ctx;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((type, title, description = "") => {
    const id =
      crypto.randomUUID?.() || Date.now().toString();

    const newToast = {
      id,
      type,
      title,
      description,
    };

    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      remove(id);
    }, 4000);
  }, [remove]);

  const success = useCallback(
    (title, description) =>
      show("success", title, description),
    [show]
  );

  const error = useCallback(
    (title, description) =>
      show("error", title, description),
    [show]
  );

  const info = useCallback(
    (title, description) =>
      show("info", title, description),
    [show]
  );

  const warning = useCallback(
    (title, description) =>
      show("warning", title, description),
    [show]
  );

  const value = useMemo(
    () => ({
      toasts,
      remove,
      success,
      error,
      info,
      warning,
    }),
    [toasts, remove, success, error, info, warning]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
}