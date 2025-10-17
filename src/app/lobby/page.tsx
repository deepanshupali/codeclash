// app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

import Lobby from "@/components/Lobby/lobby";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/");

  return <Lobby session={session} />;
}
