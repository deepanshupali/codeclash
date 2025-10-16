"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { LuClapperboard } from "react-icons/lu";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";

type JoinRoomProps = {
  roomType: "Join" | "Create";
};

const Room = ({ roomType }: JoinRoomProps) => {
  const [roomName, setRoomName] = React.useState("");
  const [roomId, setRoomId] = React.useState("");
  const [difficulty, setDifficulty] = React.useState("easy"); // NEW state for difficulty
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  async function handleClick() {
    if (loading) return;
    setLoading(true);

    const isCreate = roomType === "Create";
    const endpoint = isCreate ? "/api/rooms" : "/api/rooms/join";
    const payload = isCreate
      ? { title: roomName, difficulty } // INCLUDE difficulty
      : { roomId };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Room data:", data);
        router.push(`/lobby/${isCreate ? data.id : data.roomId}`);
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Network error or server not responding");
    } finally {
      setLoading(false);
    }
  }

  const isCreateDisabled = roomType === "Create" && (!difficulty || loading);

  return (
    <Card className="w-full max-w-md mx-auto mt-10 shadow-lg bg-white dark:bg-neutral-900 flex flex-col border border-neutral-200 dark:border-neutral-800">
      <CardHeader className="flex flex-col items-center space-y-4">
        <div className="p-4 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-300 shadow-lg">
          <LuClapperboard className="text-4xl text-white" />
        </div>

        <CardTitle className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          {roomType} Room
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {roomType === "Create" ? (
          <>
            <Input
              placeholder="Enter room name"
              className="w-full bg-white dark:bg-neutral-800 py-6 rounded-xl text-xl font-medium"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
            <select
              className="w-full bg-white dark:bg-neutral-800 py-3 px-3 rounded-xl text-lg border dark:border-neutral-700"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="easy" disabled>
                Easy
              </option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </>
        ) : (
          <InputOTP maxLength={4} value={roomId} onChange={(e) => setRoomId(e)}>
            <InputOTPGroup className="flex justify-center mx-auto gap-4">
              {[0, 1, 2, 3].map((i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className="bg-white dark:bg-neutral-800 p-6 rounded-md"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        )}
      </CardContent>

      <CardFooter>
        <Button
          className="w-full bg-yellow-500 text-black text-xl font-semibold !p-6 rounded-xl hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2 shadow-md"
          onClick={handleClick}
          disabled={isCreateDisabled}
        >
          {loading ? (
            <>
              <ClipLoader size={24} />
              <span>Processing...</span>
            </>
          ) : (
            `${roomType} Room`
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Room;
