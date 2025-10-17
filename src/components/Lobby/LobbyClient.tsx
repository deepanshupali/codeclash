// page where user can code in real-time with other users in the room
"use client";

import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusherClient";
import { MembershipWithUser, RoomWithMembers } from "@custom-types/index";

import { ResizableCode } from "@/components/arena/Resizable";
import { Button } from "@/components/ui/button";
import { IoIosArrowBack } from "react-icons/io";
import { FaUserFriends } from "react-icons/fa";

import { ImExit } from "react-icons/im";

// import OnlineUsers from "./Room/RoomUser/OnlineUser";

import { ClipLoader } from "react-spinners";
import { Question } from "@prisma/client";

export default function LobbyClient({
  roomInfo,
  currentUserId,
  question,
}: {
  roomInfo: RoomWithMembers;
  currentUserId: string;
  question: Question;
}) {
  const [members, setMembers] = useState<MembershipWithUser[]>(
    roomInfo.memberships
  );
  const [isAdmin] = useState(roomInfo.adminId === currentUserId);

  const [isLeaving, setIsLeaving] = useState(false);
  const [challengeStarted, setChallengeStarted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(40 * 60); // 40 min in seconds
  async function startChallenge() {
    await fetch("/api/rooms/startChallenge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId: roomInfo.id }),
    });
  }
  useEffect(() => {
    if (roomInfo.challengeStarted && roomInfo.challengeStartTime) {
      setChallengeStarted(true);
      setStartTime(new Date(roomInfo.challengeStartTime).getTime()); // ✅ FIX
    }
  }, [roomInfo]);

  // Timer countdown
  useEffect(() => {
    if (!challengeStarted || !startTime) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const secondsPassed = Math.floor((now - startTime) / 1000);
      const remaining = 40 * 60 - secondsPassed;

      if (remaining <= 0) {
        clearInterval(interval);
        window.location.href = `/lobby/${roomInfo.id}/results`;
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [challengeStarted, startTime, roomInfo.id]);

  function formatTime(seconds: number) {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  }

  useEffect(() => {
    const channel = pusherClient.subscribe(`room-${roomInfo.id}`);

    channel.bind("member-joined", (data: { membership: MembershipWithUser }) =>
      setMembers((prev) => [...prev, data.membership])
    );
    channel.bind("member-left", (data: { userId: string }) =>
      setMembers((prev) => prev.filter((m) => m.userId !== data.userId))
    );
    channel.bind(
      "member-kicked",
      (data: { userId: string; message: string }) => {
        if (data.userId === currentUserId) {
          alert(data.message);
          window.location.href = "/lobby";
        } else {
          setMembers((prev) => prev.filter((m) => m.userId !== data.userId));
        }
      }
    );
    channel.bind("room-deleted", (data: { message: string }) => {
      alert(data.message);
      window.location.href = "/lobby";
    });
    channel.bind("challenge-started", (data: { startTime: string }) => {
      setChallengeStarted(true);
      setStartTime(new Date(data.startTime).getTime()); // ✅ FIX
    });

    return () => pusherClient.unsubscribe(`room-${roomInfo.id}`);
  }, [roomInfo.id, currentUserId]);

  //   async function kickUser(userId: string) {
  //     await fetch("/api/rooms/kick", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ roomId: roomInfo.id, userId }),
  //     });
  //   }

  async function leaveRoom() {
    if (isLeaving) return;
    setIsLeaving(true);
    try {
      const res = await fetch("/api/rooms/leave", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        window.location.href = data.redirect || "/lobby";
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to leave room");
    } finally {
      setIsLeaving(false);
    }
  }

  function navToWatchParty() {
    window.location.href = "/watchparty";
  }

  return (
    <div className="flex flex-col h-screen">
      <nav className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-lg">
            <IoIosArrowBack className="text-xl" />
          </Button>
          <h1 className="text-xl font-bold">Room: {roomInfo.title}</h1>
          <Button variant="outline" className="flex items-center gap-1 text-sm">
            <FaUserFriends />
            <span>{members.length}</span>
          </Button>
        </div>

        <div className="flex items-center gap-2 mt-3 sm:mt-0">
          <Button
            onClick={leaveRoom}
            variant="destructive"
            disabled={isLeaving}
            className="flex items-center gap-2 cursor-pointer"
          >
            {isLeaving ? (
              <>
                <ClipLoader size={18} color="#fff" />
                Leaving...
              </>
            ) : (
              <>
                <ImExit />
                Leave
              </>
            )}
          </Button>
          {challengeStarted && (
            <div className="text-lg font-semibold text-red-600">
              ⏳ {formatTime(timeLeft)}
            </div>
          )}
        </div>
      </nav>

      {/* ---- WAITING ROOM & START LOGIC ---- */}
      {!challengeStarted ? (
        <div className="flex flex-col justify-center items-center flex-1 text-center">
          <h2 className="text-xl font-semibold mb-4">
            {members.length <= 1
              ? "Waiting for more players..."
              : "Ready to start the challenge?"}
          </h2>

          <p className="text-gray-500 mb-6">
            {members.length <= 1
              ? "Share your room link and wait for others to join."
              : "Click start when everyone is ready!"}
          </p>

          {isAdmin ? (
            <Button
              onClick={startChallenge}
              disabled={members.length <= 1}
              className="bg-green-600 hover:bg-green-700"
            >
              Start Challenge
            </Button>
          ) : (
            <Button variant="outline" disabled>
              Waiting for admin to start...
            </Button>
          )}
        </div>
      ) : (
        <div className="flex flex-col flex-1">
          <ResizableCode question={question} />
        </div>
      )}
    </div>
  );
}
