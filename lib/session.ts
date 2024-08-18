// lib/session.ts
import { getServerSession } from "next-auth/next";
import { options } from "../app/api/auth/[...nextauth]/options";

export async function getCurrentUser() {
    return await getServerSession(options);
  }