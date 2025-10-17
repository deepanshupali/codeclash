import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { pusher } from "@/lib/pusher";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { roomId } = await req.json();
    const userId = session.user.id;

    if (!roomId) {
      return NextResponse.json(
        { error: "Room ID is required" },
        { status: 400 }
      );
    }

    // ✅ Validate room
    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // ✅ Only admin can start challenge
    if (room.adminId !== userId) {
      return NextResponse.json(
        { error: "Only room admin can start the challenge" },
        { status: 403 }
      );
    }

    // ✅ Prevent starting twice
    if (room.challengeStarted) {
      return NextResponse.json(
        { error: "Challenge already started" },
        { status: 400 }
      );
    }

    const startTime = new Date();

    // ✅ Update in DB
    await prisma.room.update({
      where: { id: roomId },
      data: {
        challengeStarted: true,
        challengeStartTime: startTime,
      },
    });

    // ✅ Notify all users in room
    await pusher.trigger(`room-${roomId}`, "challenge-started", {
      startTime,
    });

    return NextResponse.json({ message: "Challenge started", startTime });
  } catch (error) {
    console.error("Error starting challenge:", error);
    return NextResponse.json(
      { error: "Failed to start challenge" },
      { status: 500 }
    );
  }
}
