"use client";

import { FcGoogle } from "react-icons/fc";
import { Sparkles } from "lucide-react";
import { Button } from "../ui/button";
// import { ClipLoader } from "react-spinners";
import { useState } from "react";
import { signIn } from "next-auth/react";
// import { signIn } from "next-auth/react";

const Hero = () => {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  async function handleGoogleLogin() {
    if (googleLoading) return;
    setGoogleLoading(true);
    try {
      await signIn("google");
    } catch (err) {
      console.error("Google sign-in error:", err);
      setGoogleLoading(false);
    }
  }

  async function handleGuestLogin() {
    if (guestLoading) return;
    setGuestLoading(true);
    try {
      await signIn("guest");
    } catch (err) {
      console.error("Guest sign-in error:", err);
      setGuestLoading(false);
    }
  }
  return (
    <section className="relative flex flex-col items-center justify-center w-full min-h-[90vh] px-6 sm:px-16 lg:px-24 py-12 bg-gradient-to-br from-white via-yellow-50 to-yellow-100 dark:from-neutral-900 dark:via-neutral-950 dark:to-black overflow-hidden transition-colors">
      {/* Decorative background blur circles */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-yellow-400/30 rounded-full blur-3xl" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-yellow-500/20 rounded-full blur-3xl" />

      {/* Centered content */}
      <div className="relative z-10 flex flex-col justify-center items-center text-center gap-8 max-w-2xl">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl 2xl:text-7xl font-extrabold leading-tight tracking-tight">
          Code & Compete
          <br />
          <span className="text-yellow-500 block mt-2">With CodeClash ⚡</span>
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl text-neutral-700 dark:text-neutral-300 leading-relaxed">
          Collaborate, build projects, and grow your dev journey — together.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={googleLoading || guestLoading}
            className=" flex items-center justify-center gap-3 py-6 text-lg font-semibold border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-70 transition-colors"
          >
            {googleLoading ? (
              <span>Signing in...</span>
            ) : (
              <>
                <FcGoogle className="text-2xl" />
                Continue with Google
              </>
            )}
          </Button>

          <Button
            type="button"
            onClick={handleGuestLogin}
            disabled={guestLoading || googleLoading}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-6 rounded-xl shadow-lg flex items-center justify-center gap-3 transform hover:scale-105 transition-transform duration-300 disabled:opacity-70"
          >
            {guestLoading ? (
              <span>Starting trial...</span>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Try for Free! 🚀
              </>
            )}
          </Button>
        </div>

        <p className="text-sm text-neutral-500 dark:text-neutral-400 italic">
          No account needed — jump right in or sign in with Google.
        </p>
      </div>
    </section>
  );
};

export default Hero;
