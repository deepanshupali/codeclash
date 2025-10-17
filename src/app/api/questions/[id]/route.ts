import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    const room = await prisma.room.findUnique({
      where: { id: params.roomId },
      include: { question: true }, // ✅ includes question data
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    if (!room.question) {
      return NextResponse.json(
        { error: "No question assigned to this room" },
        { status: 404 }
      );
    }

    return NextResponse.json(room.question, { status: 200 });
  } catch (err) {
    console.error("Error fetching room question:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
