// app/watchparty/[roomId]/RoomData.ts
import { prisma } from "@/lib/prisma";
import { RoomWithMembers } from "@custom-types/index";

export async function getRoomWithMembers(
  roomId: string
): Promise<RoomWithMembers | null> {
  return await prisma.room.findUnique({
    where: { id: roomId },
    include: {
      memberships: {
        include: { user: true }, // 👈 nested user info
      },
    },
  });
}

export async function getQuestionByRoomId(roomId: string) {
  try {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { question: true },
    });

    return room?.question || null;
  } catch (error) {
    console.error("Error fetching question for room:", error);
    return null;
  }
}
