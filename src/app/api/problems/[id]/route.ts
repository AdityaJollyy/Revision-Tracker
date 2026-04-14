import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import Problem from "@/models/Problem";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();

  const body = await req.json();
  const problem = await Problem.findOneAndUpdate(
    { _id: id, userId }, // userId guard — users can't mutate others' data
    body,
    { returnDocument: "after" },
  );

  if (!problem)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(problem);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();

  const result = await Problem.findOneAndDelete({ _id: id, userId });
  if (!result)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ success: true });
}
