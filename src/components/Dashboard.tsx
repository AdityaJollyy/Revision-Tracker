"use client";

import { useState, useMemo } from "react";
import {
  today,
  addDays,
  getRevisionDates,
  isDoneAll,
  isOverdue,
  isDueToday,
} from "@/lib/utils";
import type { IProblem } from "@/models/Problem";
import type { ProblemInput } from "@/models/Problem";
import StatCard from "./StatCard";
import RevisionCard from "./RevisionCard";
import ProblemRow from "./ProblemRow";
import AddProblemForm from "./AddProblemForm";
import SearchInput from "./SearchInput";
import EmptyState from "./EmptyState";

type View = "today" | "upcoming" | "all" | "add";

interface Props {
  initialProblems: IProblem[];
}

const NAV_ITEMS: {
  value: View;
  label: string;
  mobileLabel: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "today",
    label: "Today",
    mobileLabel: "Today",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    ),
  },
  {
    value: "upcoming",
    label: "Upcoming",
    mobileLabel: "Next",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
        />
      </svg>
    ),
  },
  {
    value: "all",
    label: "All Problems",
    mobileLabel: "All",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z"
        />
      </svg>
    ),
  },
  {
    value: "add",
    label: "+ Add New",
    mobileLabel: "Add",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
    ),
  },
];

export default function Dashboard({ initialProblems }: Props) {
  const [problems, setProblems] = useState<IProblem[]>(initialProblems);
  const [view, setView] = useState<View>("today");
  const [search, setSearch] = useState("");

  const addItemHighlight =
    "rounded-lg m-1 border border-accent/25 bg-accent-dim text-accent shadow-[0_0_0_1px_rgba(34,211,238,0.16)]";

  // ── API handlers ──

  async function handleAdd(data: ProblemInput) {
    const res = await fetch("/api/problems", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      return;
    }
    const p = await res.json();
    setProblems((prev) => [p, ...prev]);
    setView("today");
  }

  async function handleMark(id: string, idx: number) {
    const p = problems.find((x) => x._id?.toString() === id)!;
    const completed = [...p.completed];
    completed[idx] = !completed[idx];
    const res = await fetch(`/api/problems/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed }),
    });
    const updated = await res.json();
    setProblems((prev) =>
      prev.map((x) => (x._id?.toString() === id ? updated : x)),
    );
  }

  async function handleDelete(id: string) {
    await fetch(`/api/problems/${id}`, { method: "DELETE" });
    setProblems((prev) => prev.filter((x) => x._id?.toString() !== id));
  }

  // ── Derived data ──

  const tomorrowDate = addDays(today(), 1);

  const todayDue = useMemo(
    () =>
      problems.filter((p) => {
        if (isDoneAll(p)) return false;
        return getRevisionDates(p.solvedDate).some(
          (d, i) => !p.completed[i] && (isDueToday(d) || isOverdue(d)),
        );
      }),
    [problems],
  );

  const tomorrowDue = useMemo(
    () =>
      problems.filter((p) => {
        if (isDoneAll(p)) return false;
        return getRevisionDates(p.solvedDate).some(
          (d, i) => !p.completed[i] && d === tomorrowDate,
        );
      }),
    [problems, tomorrowDate],
  );

  const totalComplete = useMemo(
    () => problems.filter((p) => isDoneAll(p)).length,
    [problems],
  );

  const completionRate = useMemo(() => {
    if (problems.length === 0) return "0%";
    return `${Math.round((totalComplete / problems.length) * 100)}%`;
  }, [problems, totalComplete]);

  const filteredAll = useMemo(
    () =>
      problems.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.tag.toLowerCase().includes(search.toLowerCase()),
      ),
    [problems, search],
  );

  return (
    <div className="relative">
      {/* ── Desktop tab nav ── */}
      <div className="hidden md:block sticky top-16 z-20 bg-surface-0/80 backdrop-blur-xl border-b border-border-subtle">
        <div className="max-w-3xl mx-auto px-6">
          <nav className="flex gap-1" role="tablist">
            {NAV_ITEMS.map(({ value, label }) => (
              <button
                key={value}
                role="tab"
                aria-selected={view === value}
                onClick={() => setView(value)}
                className={`px-4 py-3 text-sm font-medium transition-colors duration-200 border-b-2 cursor-pointer ${
                  value === "add"
                    ? `${addItemHighlight} border-b-0`
                    : view === value
                      ? "border-accent text-accent"
                      : "border-transparent text-text-muted hover:text-text-secondary"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        {/* Stat cards — visible on Today view */}
        {view === "today" && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 animate-fade-in">
            <StatCard
              label="Due today"
              value={todayDue.length}
              accent={todayDue.length > 0 ? "danger" : "success"}
              icon={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              }
            />
            <StatCard
              label="Tomorrow"
              value={tomorrowDue.length}
              accent={tomorrowDue.length > 0 ? "warning" : "default"}
              icon={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                  />
                </svg>
              }
            />
            <StatCard
              label="Total"
              value={problems.length}
              icon={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z"
                  />
                </svg>
              }
            />
            <StatCard
              label="Complete"
              value={completionRate}
              accent="success"
              icon={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
              }
            />
          </div>
        )}

        {/* ── Today view ── */}
        {view === "today" && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-text-secondary">
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </h2>
            </div>

            {todayDue.length === 0 ? (
              <EmptyState
                icon={
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 12.75 6 6 9-13.5"
                    />
                  </svg>
                }
                title="All caught up"
                description="No revisions due today. Great work!"
              />
            ) : (
              <div className="flex flex-col gap-3">
                {todayDue.map((p) => (
                  <RevisionCard
                    key={p._id?.toString()}
                    p={p}
                    onMark={handleMark}
                    mode="today"
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── Upcoming view ── */}
        {view === "upcoming" && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-text-secondary">
                {new Date(tomorrowDate + "T00:00:00").toLocaleDateString(
                  "en-IN",
                  { weekday: "long", day: "numeric", month: "long" },
                )}
              </h2>
              {tomorrowDue.length > 0 && (
                <span className="text-xs font-medium text-warning px-2 py-1 rounded-md bg-warning-dim">
                  {tomorrowDue.length} due
                </span>
              )}
            </div>

            {tomorrowDue.length === 0 ? (
              <EmptyState
                icon={
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                    />
                  </svg>
                }
                title="Clear day ahead"
                description="No revisions due tomorrow."
              />
            ) : (
              <div className="flex flex-col gap-3">
                {tomorrowDue.map((p) => (
                  <RevisionCard
                    key={p._id?.toString()}
                    p={p}
                    onMark={handleMark}
                    mode="upcoming"
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── All problems view ── */}
        {view === "all" && (
          <section>
            <div className="mb-4">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search by name or tag…"
              />
            </div>
            <p className="text-xs text-text-muted font-medium mb-3">
              {filteredAll.length}{" "}
              {filteredAll.length === 1 ? "entry" : "entries"}
            </p>

            {filteredAll.length === 0 ? (
              <EmptyState
                icon={
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                    />
                  </svg>
                }
                title={search ? "No results" : "No problems yet"}
                description={
                  search
                    ? "Try a different search term."
                    : "Add your first problem to get started."
                }
                action={
                  !search && (
                    <button
                      onClick={() => setView("add")}
                      className="px-4 py-2 bg-accent text-text-inverse text-sm font-medium rounded-lg hover:bg-accent-hover transition-colors duration-200 cursor-pointer"
                    >
                      Add problem
                    </button>
                  )
                }
              />
            ) : (
              <div className="flex flex-col gap-2">
                {filteredAll.map((p) => (
                  <ProblemRow
                    key={p._id?.toString()}
                    p={p}
                    onMark={handleMark}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── Add view ── */}
        {view === "add" && <AddProblemForm onAdd={handleAdd} />}
      </div>

      {/* ── Mobile bottom nav ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-surface-0/90 backdrop-blur-xl border-t border-border-subtle">
        <div className="flex items-stretch">
          {NAV_ITEMS.map(({ value, mobileLabel, icon }) => (
            <button
              key={value}
              onClick={() => setView(value)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors duration-200 cursor-pointer ${
                value === "add"
                  ? `rounded-t-xl ${addItemHighlight}`
                  : view === value
                    ? "text-accent"
                    : "text-text-muted"
              }`}
            >
              {icon}
              {mobileLabel}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
