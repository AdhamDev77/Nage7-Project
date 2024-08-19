import type { NextAuthOptions, User as NextAuthUser } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

// Define the complete User type for NextAuth
interface User extends NextAuthUser {
  id: string;
  email: string;
  role: string;
  first_name: string;
  last_name: string;
  profile_picture: string;
  phone_number: string;
  parents_phone_number: string;
  stage: string;
  stage_2: string;
  subject: string;
}

// Define the authorizeUser function
const authorizeUser = async (credentials: { email: string; password: string }): Promise<User | null> => {
  if (!credentials?.email || !credentials?.password) {
    return null;
  }

  const user = await db.user.findUnique({
    where: { email: credentials.email },
  });

  if (!user || !user.password) {
    return null;
  }

  const isCorrectPassword = await bcrypt.compare(credentials.password, user.password);

  if (!isCorrectPassword) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    first_name: user.first_name || "Unknown",
    last_name: user.last_name || "Unknown",
    profile_picture: user.profile_picture || "Nothing",
    phone_number: user.phone_number || "Nothing",
    parents_phone_number: user.parents_phone_number || "Nothing",
    stage: user.stage || "Nothing",
    stage_2: user.stage_2 || "Nothing",
    subject: user.subject || "Nothing",
  };
};

// NextAuth configuration
export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'UserCredentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'your email' },
        password: { label: 'Password', type: 'password', placeholder: 'your password' },
      },
      async authorize(credentials, req) {
        try {
          const userCredentials = credentials as { email: string; password: string };
          const user = await authorizeUser(userCredentials);
          if (user) {
            return user; // Return the complete User object
          } else {
            return null; // Return null for invalid credentials
          }
        } catch (error) {
          console.error('Login error:', error);
          return null; // Return null if there's an error
        }
      },
    }),
  ],
  pages: {
    signIn: '/signin',
    error: '/signin',
  },
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        // Only include essential data in the session
        session.user.id = token.uid as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
        session.user.first_name = token.first_name as string;
        session.user.last_name = token.last_name as string;
        // Do not include large data such as profile pictures
        // Optionally, include some small properties only
      }
      return session;
    },
    async jwt({ user, token }) {
      if (user) {
        token.uid = user.id;
        token.email = user.email;
        token.role = user.role;
        token.first_name = user.first_name;
        token.last_name = user.last_name;
        // Do not include large data here
        // Optionally include only necessary properties
      }
      return token;
    },
  },
  
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};
