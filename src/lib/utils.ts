import { INTERVALS } from "@/constants/tracker";
import type { IProblem } from "@/models/Problem";

export function today(): string {
  return new Date().toISOString().split("T")[0];
}

export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

export function daysFromNow(dateStr: string): string {
  const diff = Math.round(
    (new Date(dateStr + "T00:00:00").getTime() -
      new Date(today() + "T00:00:00").getTime()) /
      86400000,
  );
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff < 0) return `${Math.abs(diff)}d overdue`;
  return `in ${diff}d`;
}

export function isOverdue(d: string): boolean {
  return d < today();
}

export function isDueToday(d: string): boolean {
  return d === today();
}

export function getRevisionDates(solvedDate: string): string[] {
  return INTERVALS.map((d) => addDays(solvedDate, d));
}

export function getNextRevision(p: {
  solvedDate: string;
  completed: boolean[];
}) {
  const dates = getRevisionDates(p.solvedDate);
  for (let i = 0; i < dates.length; i++) {
    if (!p.completed[i]) return { index: i, date: dates[i] };
  }
  return null;
}

export function isDoneAll(p: { completed: boolean[] }): boolean {
  return p.completed.every(Boolean);
}
