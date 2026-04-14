"use client";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-in">
      {icon && (
        <div className="w-12 h-12 rounded-xl bg-surface-2 border border-border-subtle flex items-center justify-center text-text-muted mb-5">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-text-primary mb-1.5">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-text-muted max-w-xs">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
