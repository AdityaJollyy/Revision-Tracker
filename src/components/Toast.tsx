"use client";

import { useEffect, useState } from "react";

type ToastVariant = "success" | "error" | "info";

interface ToastProps {
  message: string | null;
  variant?: ToastVariant;
  duration?: number;
  onDismiss?: () => void;
}

const variantStyles: Record<ToastVariant, string> = {
  success: "border-success/30 text-success",
  error: "border-danger/30 text-danger",
  info: "border-accent/30 text-accent",
};

export default function Toast({
  message,
  variant = "info",
  duration = 2500,
  onDismiss,
}: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => onDismiss?.(), 300);
      }, duration);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [message, duration, onDismiss]);

  if (!message) return null;

  return (
    <div
      className={`fixed bottom-24 md:bottom-8 left-1/2 z-50 -translate-x-1/2 transition-all duration-300 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-3 pointer-events-none"
      }`}
    >
      <div
        className={`px-5 py-2.5 rounded-lg bg-surface-2 border text-sm font-medium shadow-lg shadow-black/20 ${variantStyles[variant]}`}
      >
        {message}
      </div>
    </div>
  );
}
