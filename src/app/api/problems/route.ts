import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import Problem from "@/models/Problem";
import { INTERVALS } from "@/constants/tracker";

export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const problems = await Problem.find({ userId })
    .sort({ createdAt: -1 })
    .lean();
  return NextResponse.json(problems);
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const body = await req.json();

  const problem = await Problem.create({
    ...body,
    userId,
    completed: Array(INTERVALS.length).fill(false),
  });

  return NextResponse.json(problem, { status: 201 });
}
