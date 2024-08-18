// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    profile_picture: string?;
    phone_number: string;
    parents_phone_number: string?;
    stage: string?;
    stage_2: string?;
    subject: string?;
  }

  interface Session {
    user: User;
  }

  interface JWT {
    uid: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    profile_picture: string?;
    phone_number: string;
    parents_phone_number: string?;
    stage: string?;
    stage_2: string?;
    subject: string?;
  }
}
