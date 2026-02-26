import { useState, useEffect, useCallback } from "react";


export function useTimer(
  initialSeconds,
  onExpire,
  active = true
) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  useEffect(() => {
    if (!active) return;

    setTimeLeft(initialSeconds);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onExpire();
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);

  }, [active, initialSeconds, onExpire]);

  const reset = useCallback(() => {
    setTimeLeft(initialSeconds);
  }, [initialSeconds]);

  return {
    timeLeft,
    reset,
  };
}