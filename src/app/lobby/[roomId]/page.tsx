// app/watchparty/[roomId]/page.tsx
import { notFound } from "next/navigation";
import { getRoomWithMembers, getQuestionByRoomId } from "./RoomData";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ResizableCode } from "@/components/arena/Resizable";

export default async function RoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return notFound();

  const { roomId } = await params;
  const roomInfo = await getRoomWithMembers(roomId);
  if (!roomInfo) return notFound();

  // ✅ Load question using helper function
  const question = await getQuestionByRoomId(roomId);
  if (!question) return <div>No question assigned to this room.</div>;

  return <ResizableCode question={question} />;
}
