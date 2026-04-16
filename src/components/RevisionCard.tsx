"use client";

import {
  getRevisionDates,
  isDueToday,
  isOverdue,
  formatDate,
  daysFromNow,
} from "@/lib/utils";
import { INTERVALS } from "@/constants/tracker";
import type { IProblem } from "@/models/Problem";
import Badge from "./Badge";
import Spinner from "./Spinner";

interface Props {
  p: IProblem;
  onMark: (id: string, idx: number) => void;
  mode: "today" | "upcoming";
  pendingMarkKey?: string | null;
}

export default function RevisionCard({
  p,
  onMark,
  mode,
  pendingMarkKey,
}: Props) {
  const dates = getRevisionDates(p.solvedDate);
  const id = p._id?.toString() ?? "";
  const isConcept = p.entryType === "concept";

  const dueRevisions =
    mode === "today"
      ? dates
          .map((date, i) => ({ date, index: i, interval: INTERVALS[i] }))
          .filter(
            ({ date, index }) =>
              !p.completed[index] && (isDueToday(date) || isOverdue(date)),
          )
      : dates
          .map((date, i) => ({ date, index: i, interval: INTERVALS[i] }))
          .filter(
            ({ date, index }) => !p.completed[index] && date === dates[0], // Will be filtered externally
          );

  // Re-derive for upcoming (tomorrow): filter by tomorrow date
  const filteredRevisions =
    mode === "upcoming"
      ? dates
          .map((date, i) => ({ date, index: i, interval: INTERVALS[i] }))
          .filter(({ date, index }) => {
            if (p.completed[index]) return false;
            // Upcoming: not overdue, not today
            return !isDueToday(date) && !isOverdue(date);
          })
          .slice(0, 1) // Show only next upcoming revision
      : dueRevisions;

  const displayRevisions = mode === "today" ? dueRevisions : filteredRevisions;

  return (
    <div className="group rounded-xl bg-surface-1 border border-border-subtle hover:border-border-default transition-colors duration-200 overflow-hidden animate-slide-up">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-text-primary truncate">
              {p.name}
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Solved {formatDate(p.solvedDate)}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap justify-end gap-1.5 text-right">
            <Badge variant={isConcept ? "success" : "accent"}>
              {isConcept ? "CONCEPT" : "PROBLEM"}
            </Badge>
            {!isConcept && p.tag && <Badge variant="neutral">{p.tag}</Badge>}
          </div>
          {p.link && (
            <a
              href={p.link}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 w-8 h-8 rounded-lg bg-surface-2 border border-border-subtle flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/30 transition-colors duration-200"
              title="Open link"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                />
              </svg>
            </a>
          )}
        </div>

        {/* Revision rows */}
        <div className="flex flex-col gap-2">
          {displayRevisions.map(({ date, index, interval }) => {
            const overdue = isOverdue(date);
            const isMarking = pendingMarkKey === `${id}:${index}`;
            return (
              <div
                key={index}
                className={`flex items-center justify-between rounded-lg px-3 py-2.5 border transition-colors duration-200 ${
                  overdue
                    ? "bg-danger-dim border-danger/20"
                    : mode === "today"
                      ? "bg-accent-dim border-accent/20"
                      : "bg-surface-2 border-border-subtle"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-semibold ${
                      overdue ? "text-danger" : "text-accent"
                    }`}
                  >
                    Day {interval}
                  </span>
                  <span className="text-xs text-text-muted">
                    {overdue ? daysFromNow(date) : formatDate(date)}
                  </span>
                </div>
                <button
                  disabled={isMarking}
                  onClick={() => onMark(id, index)}
                  className={`inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-70 ${
                    overdue
                      ? "bg-danger/10 text-danger hover:bg-danger/20 border border-danger/30"
                      : "bg-accent/10 text-accent hover:bg-accent/20 border border-accent/30"
                  }`}
                >
                  {isMarking && <Spinner className="w-3 h-3" />}
                  Mark done
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
