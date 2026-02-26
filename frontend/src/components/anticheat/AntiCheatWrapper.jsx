import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

const AntiCheatWrapper = ({ antiCheat = {}, children }) => {
  
  useEffect(() => {
    if (antiCheat.violations >= 2 && antiCheat.onAutoSubmit) {
      antiCheat.onAutoSubmit();
    }
  }, [antiCheat.violations, antiCheat.onAutoSubmit]);

  return (
    <>
      {antiCheat.showWarning && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 flex items-center gap-2 text-sm text-destructive animate-fade-in">

          <AlertTriangle className="w-4 h-4 shrink-0" />

          <span>
            <strong>
              Warning ({antiCheat.violations}/{antiCheat.maxViolations}):
            </strong>{" "}

            {antiCheat.lastViolationType === "tab_switch" &&
              "Tab switch detected!"}

            {antiCheat.lastViolationType === "fullscreen_exit" &&
              "You exited fullscreen!"}

            {antiCheat.lastViolationType === "inactivity" &&
              "Inactivity detected!"}

            {antiCheat.lastViolationType === "right_click" &&
              "Right-click is disabled!"}

            {antiCheat.lastViolationType === "copy_attempt" &&
              "Copying is disabled!"}

            {" "}Quiz will auto-submit at 2 violations.
          </span>

          <button
            onClick={antiCheat.dismissWarning}
            className="ml-auto text-xs underline shrink-0"
          >
            Dismiss
          </button>

        </div>
      )}

      {children}
    </>
  );
};

export default AntiCheatWrapper;