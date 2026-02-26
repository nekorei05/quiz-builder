export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function formatTime(seconds) {

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function percentOf(part, total) {

  if (!total) return 0;

  return Math.round((part / total) * 100);
}