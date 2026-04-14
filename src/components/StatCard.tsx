"use client";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  accent?: "default" | "danger" | "success" | "warning";
}

const accentBorder: Record<string, string> = {
  default: "border-border-subtle hover:border-border-default",
  danger: "border-danger/20 hover:border-danger/40",
  success: "border-success/20 hover:border-success/40",
  warning: "border-warning/20 hover:border-warning/40",
};

const accentIcon: Record<string, string> = {
  default: "text-accent bg-accent-dim",
  danger: "text-danger bg-danger-dim",
  success: "text-success bg-success-dim",
  warning: "text-warning bg-warning-dim",
};

export default function StatCard({
  label,
  value,
  icon,
  accent = "default",
}: StatCardProps) {
  return (
    <div
      className={`p-4 rounded-xl bg-surface-1 border transition-colors duration-200 ${accentBorder[accent]}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
          {label}
        </span>
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center ${accentIcon[accent]}`}
        >
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-text-primary tabular-nums">
        {value}
      </p>
    </div>
  );
}
