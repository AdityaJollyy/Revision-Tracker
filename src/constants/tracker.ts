export const INTERVALS = [1, 3, 7, 15, 30, 60, 120] as const;

export const TAGS = [
  "Array",
  "String",
  "Tree",
  "Graph",
  "DP",
  "Stack",
  "Queue",
  "Heap",
  "Greedy",
  "Binary Search",
  "Backtracking",
  "Linked List",
  "Math",
  "Other",
] as const;

export const ENTRY_TYPES = [
  { value: "problem", label: "Problem" },
  { value: "concept", label: "Concept" },
] as const;

export type EntryType = "problem" | "concept";
export type Tag = (typeof TAGS)[number];
