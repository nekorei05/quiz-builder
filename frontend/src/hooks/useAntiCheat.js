import { useState, useEffect, useCallback, useRef } from "react";
import { MAX_VIOLATIONS, INACTIVITY_TIMEOUT } from "@/utils/constants";

export function useAntiCheat(isActive, onAutoSubmit, maxViolations = MAX_VIOLATIONS) {
  const [violations, setViolations] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastViolationType, setLastViolationType] = useState(null);
  const [showWarning, setShowWarning] = useState(false);

  const activityTimerRef = useRef(null);

  const addViolation = useCallback((type) => {
    setViolations((prev) => prev + 1);
    setLastViolationType(type);
    setShowWarning(true);
  }, []);

  useEffect(() => {
    if (violations >= maxViolations) {
      setTimeout(() => {
        if (onAutoSubmit) onAutoSubmit();
      }, 500);
    }
  }, [violations, maxViolations, onAutoSubmit]);

  const dismissWarning = useCallback(() => {
    setShowWarning(false);
  }, []);

  const requestFullscreen = useCallback(async () => {
    try {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } catch (err) {
      console.warn("Fullscreen request failed:", err);
    }
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const handleVisibilityChange = () => {
      if (document.hidden) addViolation("tab_switch");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isActive, addViolation]);

  useEffect(() => {
    if (!isActive) return;

    const handleFullscreenChange = () => {
      const currentlyFullscreen = !!document.fullscreenElement;

      if (!currentlyFullscreen && isFullscreen) {
        addViolation("fullscreen_exit");
      }

      setIsFullscreen(currentlyFullscreen);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [isActive, addViolation, isFullscreen]);

  useEffect(() => {
    if (!isActive) return;

    const resetTimer = () => {
      if (activityTimerRef.current) clearTimeout(activityTimerRef.current);

      activityTimerRef.current = setTimeout(() => {
        addViolation("inactivity");
      }, INACTIVITY_TIMEOUT);
    };

    resetTimer();

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);

    return () => {
      if (activityTimerRef.current) clearTimeout(activityTimerRef.current);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
    };
  }, [isActive, addViolation]);

  useEffect(() => {
    if (!isActive) return;

    const handleContextMenu = (e) => {
      e.preventDefault();
      addViolation("right_click");
    };

    const handleCopy = (e) => {
      e.preventDefault();
      addViolation("copy_attempt");
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopy);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopy);
    };
  }, [isActive, addViolation]);

  return {
    violations,
    maxViolations,
    isFullscreen,
    lastViolationType,
    showWarning,
    dismissWarning,
    requestFullscreen,
  };
}