"use client";

import { useState } from "react";
import { today, addDays, formatDate } from "@/lib/utils";
import { INTERVALS, TAGS, ENTRY_TYPES } from "@/constants/tracker";
import type { EntryType, Tag } from "@/constants/tracker";
import type { ProblemInput } from "@/models/Problem";
import Spinner from "./Spinner";

interface FormState {
  entryType: EntryType;
  name: string;
  tag: Tag | "";
  solvedDate: string;
  link: string;
}

interface Props {
  onAdd: (data: ProblemInput) => Promise<boolean>;
}

const inputBase =
  "w-full bg-surface-2 border border-border-subtle rounded-lg px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent/50 transition-colors duration-200";

const labelBase = "block text-xs font-medium text-text-secondary mb-1.5";

export default function AddProblemForm({ onAdd }: Props) {
  const [form, setForm] = useState<FormState>({
    entryType: "problem",
    name: "",
    tag: "Array",
    solvedDate: today(),
    link: "",
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!form.name.trim()) return;
    setLoading(true);
    try {
      const saved = await onAdd({
        ...form,
        tag: form.entryType === "concept" ? "" : form.tag,
      });

      if (saved) {
        setForm({
          entryType: "problem",
          name: "",
          tag: "Array",
          solvedDate: today(),
          link: "",
        });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="max-w-lg mx-auto">
        <div className="rounded-xl bg-surface-1 border border-border-subtle p-5 sm:p-6">
          <h2 className="text-base font-semibold text-text-primary mb-5">
            {form.entryType === "concept" ? "Add concept" : "Add problem"}
          </h2>

          {/* Entry type toggle */}
          <div className="flex gap-1 p-1 bg-surface-2 rounded-lg mb-5">
            {ENTRY_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    entryType: t.value as EntryType,
                    tag: t.value === "concept" ? "" : "Array",
                  }))
                }
                className={`flex-1 py-2 rounded-md text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  form.entryType === t.value
                    ? "bg-surface-0 text-text-primary shadow-sm"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Name */}
          <label className={labelBase}>
            {form.entryType === "concept" ? "Concept name" : "Problem name"}
          </label>
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder={
              form.entryType === "concept"
                ? "e.g. Recursion on Trees"
                : "e.g. Two Sum"
            }
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className={`${inputBase} mb-4`}
            autoFocus
          />

          {/* Tag */}
          {form.entryType === "problem" && (
            <>
              <label className={labelBase}>Topic tag</label>
              <select
                value={form.tag}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tag: e.target.value as Tag }))
                }
                className={`${inputBase} mb-4`}
              >
                {TAGS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </>
          )}

          {/* Date */}
          <label className={labelBase}>Date solved</label>
          <input
            type="date"
            value={form.solvedDate}
            onChange={(e) =>
              setForm((f) => ({ ...f, solvedDate: e.target.value }))
            }
            className={`${inputBase} mb-4`}
          />

          {/* Link */}
          <label className={labelBase}>
            {form.entryType === "concept"
              ? "Reference link (optional)"
              : "Problem link (optional)"}
          </label>
          <input
            value={form.link}
            onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
            placeholder={
              form.entryType === "concept"
                ? "https://example.com/notes/…"
                : "https://leetcode.com/problems/…"
            }
            className={`${inputBase} mb-5`}
          />

          {/* Schedule preview */}
          <label className={labelBase}>Revision schedule</label>
          <div className="flex flex-wrap gap-1.5 mb-6">
            {INTERVALS.map((d) => (
              <span
                key={d}
                className="px-2.5 py-1 rounded-md bg-surface-2 border border-border-subtle text-[11px] font-medium text-text-muted"
              >
                Day {d} · {formatDate(addDays(form.solvedDate, d))}
              </span>
            ))}
          </div>

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !form.name.trim()}
            className="w-full py-3 bg-accent text-text-inverse font-semibold text-sm rounded-lg hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer inline-flex items-center justify-center gap-2"
          >
            {loading && <Spinner className="w-4 h-4 text-text-inverse" />}
            {loading
              ? "Adding…"
              : `Add ${form.entryType === "concept" ? "concept" : "problem"}`}
          </button>
        </div>
      </div>
    </div>
  );
}
