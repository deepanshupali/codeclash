import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const questions = await prisma.question.findMany();
  return NextResponse.json(questions);
}

export async function POST(req) {
  const data = await req.json();
  const question = await prisma.question.create({ data });
  return NextResponse.json(question, { status: 201 });
}
