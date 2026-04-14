"use client";

type BadgeVariant = "accent" | "success" | "danger" | "warning" | "neutral";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  accent:
    "bg-accent-dim text-accent border-accent-muted/40",
  success:
    "bg-success-dim text-success border-success-muted/40",
  danger:
    "bg-danger-dim text-danger border-danger-muted/40",
  warning:
    "bg-warning-dim text-warning border-warning-muted/40",
  neutral:
    "bg-surface-2 text-text-muted border-border-default",
};

export default function Badge({
  children,
  variant = "neutral",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold tracking-wide border leading-none ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
