import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import argon2 from "argon2";

const authorizeUser = async (credentials: { email: string; password: string }) => {
  if (!credentials?.email || !credentials?.password) {
    throw new Error("Invalid credentials");
  }

  const user = await db.user.findUnique({
    where: { email: credentials.email },
  });

  if (!user || !user.password) {
    throw new Error("Invalid credentials");
  }

  const isCorrectPassword = await argon2.verify(user.password, credentials.password);

  if (!isCorrectPassword) {
    throw new Error("Invalid credentials");
  }

  return {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    role: user.role,
    profile_picture: user.profile_picture,
    phone_number: user.phone_number,
    parents_phone_number: user.parents_phone_number,
    stage: user.stage,
    stage_2: user.stage_2,
    subject: user.subject,
  };
};

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "UserCredentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "your email" },
        password: { label: "Password", type: "password", placeholder: "your password" },
      },
      async authorize(credentials) {
        try {
          return await authorizeUser(credentials as { email: string; password: string });
        } catch (error) {
          console.error("Login error:", error);
          throw new Error("CredentialsSignin");
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.uid;
        session.user.first_name = token.first_name;
        session.user.last_name = token.last_name;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.profile_picture = token.profile_picture;
        session.user.phone_number = token.phone_number;
        session.user.parents_phone_number = token.parents_phone_number;
        session.user.stage = token.stage;
        session.user.stage_2 = token.stage_2;
        session.user.subject = token.subject;
      }
      return session;
    },
    async jwt({ user, token }) {
      if (user) {
        token.uid = user.id;
        token.first_name = user.first_name;
        token.last_name = user.last_name;
        token.email = user.email;
        token.role = user.role;
        token.profile_picture = user.profile_picture;
        token.phone_number = user.phone_number;
        token.parents_phone_number = user.parents_phone_number;
        token.stage = user.stage;
        token.stage_2 = user.stage_2;
        token.subject = user.subject;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
