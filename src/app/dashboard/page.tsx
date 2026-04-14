import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import Problem from "@/models/Problem";
import Dashboard from "@/components/Dashboard";

export default async function DashboardPage() {
  const { userId } = await auth();

  await connectDB();
  const raw = await Problem.find({ userId }).sort({ createdAt: -1 }).lean();

  // Convert Mongoose docs to plain JSON-serialisable objects
  const problems = JSON.parse(JSON.stringify(raw));

  return <Dashboard initialProblems={problems} />;
}
