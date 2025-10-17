// page for lobby where user can create or join room
import React from "react";
import Room from "@/components/Lobby/Room";
import Rimage from "../../../public/2.png";
import Image from "next/image";
import LogoutButton from "@/components/LogoutBtn";

interface Session {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const Lobby = ({ session }: { session: Session }) => {
  function toNameCase(str: string): string {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
  return (
    <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden text-neutral-900 dark:text-neutral-100 transition-colors duration-700 bg-gradient-to-br from-white via-yellow-50 to-yellow-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-black">
      {/* == Yellow Glow Layers == */}
      <div className="absolute top-[-150px] left-[-180px] w-[500px] h-[500px] bg-yellow-300/30 dark:bg-yellow-500/15 rounded-full blur-[130px]" />
      <div className="absolute bottom-[-150px] right-[-180px] w-[500px] h-[500px] bg-amber-400/30 dark:bg-amber-600/20 rounded-full blur-[130px]" />
      <div className="absolute top-[35%] right-[25%] w-[280px] h-[280px] bg-orange-300/25 dark:bg-orange-500/20 rounded-full blur-[100px]" />
      <div className="absolute top-[50%] left-[15%] w-[300px] h-[300px] bg-yellow-200/20 dark:bg-yellow-700/15 rounded-full blur-[100px]" />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-yellow-100/10 dark:via-neutral-900/10 dark:to-yellow-900/5" />

      {/* Logout Button */}
      <div className="absolute top-6 right-6 z-20">
        <LogoutButton />
      </div>

      {/* Dashboard Content */}
      <div className="relative z-10 max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center px-6 sm:px-12 md:px-16">
        {/* Left Section */}
        <div className="flex flex-col gap-10 justify-center items-center md:items-start text-center md:text-left">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-snug bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 dark:from-yellow-400 dark:via-amber-400 dark:to-orange-400 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]">
              Welcome, {toNameCase(session.user?.name || "User")} 👋
            </h1>
            <p className="mt-4 text-lg text-neutral-700 dark:text-neutral-400 max-w-md">
              Turn DSA into a competitive sport — challenge friends now.
            </p>
          </div>

          <Image
            src={Rimage}
            alt="Illustration"
            width={540}
            priority
            className="drop-shadow-[0_15px_40px_rgba(251,191,36,0.35)] rounded-3xl transform hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Right Section */}
        <div className="flex flex-col items-center md:items-start w-full gap-6">
          <div className="flex flex-col gap-6 w-full max-w-md mx-auto md:mx-0">
            <Room roomType="Join" />
            <Room roomType="Create" />
          </div>

          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-3 text-center md:text-left italic">
            💡 Pro tip: Share your room ID with friends to sync instantly!
          </p>
        </div>
      </div>
    </main>
  );
};

export default Lobby;
