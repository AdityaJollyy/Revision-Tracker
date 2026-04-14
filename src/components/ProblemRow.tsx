"use client";

import { useState } from "react";
import {
  getRevisionDates,
  isOverdue,
  isDueToday,
  isDoneAll,
  getNextRevision,
  daysFromNow,
  formatDate,
} from "@/lib/utils";
import { INTERVALS } from "@/constants/tracker";
import type { IProblem } from "@/models/Problem";
import Badge from "./Badge";
import ProgressBar from "./ProgressBar";

interface Props {
  p: IProblem;
  onMark: (id: string, idx: number) => void;
  onDelete: (id: string) => void;
}

export default function ProblemRow({ p, onMark, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const id = p._id?.toString()!;
  const done = isDoneAll(p);
  const next = getNextRevision(p);
  const dates = getRevisionDates(p.solvedDate);
  const isConcept = p.entryType === "concept";

  return (
    <div
      className={`rounded-xl border overflow-hidden transition-colors duration-200 animate-slide-up ${
        done
          ? "bg-success-dim border-success/15"
          : "bg-surface-1 border-border-subtle hover:border-border-default"
      }`}
    >
      {/* Collapsed row */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4 cursor-pointer focus-ring rounded-xl"
      >
        <div className="flex items-center gap-3">
          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap mb-1">
              <Badge variant={isConcept ? "success" : "accent"}>
                {isConcept ? "CONCEPT" : "PROBLEM"}
              </Badge>
              {!isConcept && p.tag && (
                <Badge variant="neutral">{p.tag}</Badge>
              )}
              {done && <Badge variant="success">COMPLETE</Badge>}
            </div>
            <h3
              className={`text-sm font-medium truncate ${
                done ? "text-text-muted" : "text-text-primary"
              }`}
            >
              {p.name}
            </h3>
          </div>

          {/* Right: status */}
          <div className="shrink-0 text-right">
            {!done && next && (
              <p
                className={`text-xs font-medium ${
                  isOverdue(next.date) ? "text-danger" : "text-text-muted"
                }`}
              >
                {daysFromNow(next.date)}
              </p>
            )}
          </div>

          {/* Chevron */}
          <svg
            className={`w-4 h-4 text-text-muted shrink-0 transition-transform duration-200 ${
              expanded ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <ProgressBar completed={p.completed} />
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-border-subtle px-4 pb-4 pt-3 animate-slide-down">
          <p className="text-xs text-text-muted mb-3">
            Solved {formatDate(p.solvedDate)}
          </p>

          {/* Revision timeline */}
          <div className="flex flex-col gap-1.5 mb-4">
            {INTERVALS.map((interval, i) => {
              const date = dates[i];
              const isDone = p.completed[i];
              const overdue = !isDone && isOverdue(date);
              const dueNow = !isDone && isDueToday(date);

              return (
                <div
                  key={i}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs border transition-colors duration-200 ${
                    isDone
                      ? "bg-success-dim border-success/15"
                      : overdue
                        ? "bg-danger-dim border-danger/20"
                        : dueNow
                          ? "bg-accent-dim border-accent/20"
                          : "bg-surface-2 border-border-subtle"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {isDone ? (
                      <svg className="w-3.5 h-3.5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    ) : overdue ? (
                      <svg className="w-3.5 h-3.5 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126Z" />
                      </svg>
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-border-strong" />
                    )}
                    <span
                      className={`font-medium ${
                        isDone ? "text-text-muted" : "text-text-primary"
                      }`}
                    >
                      Day {interval}
                    </span>
                    <span className="text-text-muted">
                      {formatDate(date)}
                      {overdue && " · overdue"}
                      {dueNow && " · today"}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMark(id, i);
                    }}
                    className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer transition-colors duration-200 border ${
                      isDone
                        ? "bg-surface-2 border-border-default text-text-muted hover:text-text-secondary"
                        : "bg-accent/10 border-accent/30 text-accent hover:bg-accent/20"
                    }`}
                  >
                    {isDone ? "Undo" : "Done"}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {p.link && (
              <a
                href={p.link}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-surface-2 border border-border-subtle text-xs font-medium text-text-secondary hover:text-accent hover:border-accent/30 transition-colors duration-200 no-underline"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
                Open link
              </a>
            )}
            {!confirmDelete ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmDelete(true);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-surface-2 border border-border-subtle text-xs font-medium text-text-muted hover:text-danger hover:border-danger/30 transition-colors duration-200 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
                Delete
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(id);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-danger-dim border border-danger/30 text-xs font-semibold text-danger hover:bg-danger/20 transition-colors duration-200 cursor-pointer"
              >
                Confirm delete
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
