"use client";

interface ProgressBarProps {
  completed: boolean[];
  size?: "sm" | "md";
}

export default function ProgressBar({
  completed,
  size = "sm",
}: ProgressBarProps) {
  const total = completed.length;
  const done = completed.filter(Boolean).length;
  const percentage = total > 0 ? (done / total) * 100 : 0;
  const isComplete = done === total;

  const heightCls = size === "sm" ? "h-1" : "h-1.5";

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`flex-1 ${heightCls} rounded-full bg-surface-3 overflow-hidden`}
      >
        <div
          className={`${heightCls} rounded-full transition-all duration-500 ease-out ${
            isComplete ? "bg-success" : "bg-accent"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span
        className={`text-[11px] font-medium tabular-nums ${
          isComplete ? "text-success" : "text-text-muted"
        }`}
      >
        {done}/{total}
      </span>
    </div>
  );
}
