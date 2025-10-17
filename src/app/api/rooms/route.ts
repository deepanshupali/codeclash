import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

// Helper: generate random 4-digit string
function generateRoomId() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export async function POST(req: Request) {
  const body = await req.json();
  const { title, difficulty } = body;

  const session = await getServerSession(authOptions);
  console.log("Session:", session);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Type assertion to include 'id' property on user
  const userId = session.user.id;

  // ensure user doesn't already have a room
  const existingRoom = await prisma.room.findUnique({
    where: { adminId: userId },
  });
  if (existingRoom) {
    return NextResponse.json(
      { error: "User already has a room" },
      { status: 400 }
    );
  }
  // ⭐ Get a RANDOM question by difficulty
  const questions = await prisma.question.findMany({
    where: { difficulty },
  });
  if (questions.length === 0) {
    return NextResponse.json(
      { error: `No ${difficulty} questions available.` },
      { status: 404 }
    );
  }
  const randomQuestion =
    questions[Math.floor(Math.random() * questions.length)];

  // generate unique 4 digit ID
  let roomId: string;
  while (true) {
    const candidate = generateRoomId();
    const exists = await prisma.room.findUnique({ where: { id: candidate } });
    if (!exists) {
      roomId = candidate;
      break;
    }
  }

  // create room
  // create room + admin membership
  const room = await prisma.room.create({
    data: {
      id: roomId,
      title: title || `Room ${roomId}`,
      adminId: userId,
      questionId: randomQuestion.id, // ⭐ store question here
      memberships: {
        create: {
          userId,
          role: "admin", // admin role for room creator
        },
      },
    },
    include: {
      memberships: true,
    },
  });

  return NextResponse.json({
    id: room.id,
    title: room.title,
    questionId: randomQuestion.id,
  });
}
