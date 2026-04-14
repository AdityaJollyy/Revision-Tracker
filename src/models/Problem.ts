import mongoose from "mongoose";
import type { Document, Model } from "mongoose";
import { INTERVALS } from "@/constants/tracker";
import type { EntryType, Tag } from "@/constants/tracker";

const { Schema } = mongoose;

export interface IProblem extends Document {
  userId: string; // Clerk userId — scopes data per user
  entryType: EntryType;
  name: string;
  tag: Tag | "";
  solvedDate: string; // "YYYY-MM-DD"
  link: string;
  completed: boolean[]; // length === INTERVALS.length
  createdAt: Date;
  updatedAt: Date;
}

export type ProblemInput = Pick<
  IProblem,
  "entryType" | "name" | "tag" | "solvedDate" | "link"
>;

const ProblemSchema = new Schema<IProblem>(
  {
    userId: { type: String, required: true, index: true },
    entryType: {
      type: String,
      enum: ["problem", "concept"],
      default: "problem",
    },
    name: { type: String, required: true },
    tag: { type: String, default: "" },
    solvedDate: { type: String, required: true },
    link: { type: String, default: "" },
    completed: {
      type: [Boolean],
      default: () => Array(INTERVALS.length).fill(false),
    },
  },
  { timestamps: true },
);

const Problem: Model<IProblem> =
  mongoose.models.Problem || mongoose.model<IProblem>("Problem", ProblemSchema);

export default Problem;
