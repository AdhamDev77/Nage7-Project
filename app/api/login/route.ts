import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import argon2 from 'argon2';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Define the schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({
        error: result.error.errors.map(err => err.message).join(', '),
      }, { status: 400 });
    }

    const { email, password } = result.data;

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // Verify the password using Argon2
    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // Handle successful login (e.g., create a session or JWT)
    // For this example, we'll just return the user data
    return NextResponse.json({ message: 'Login successful', user: user }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'An error occurred while logging in.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// export const config = {
//   api: {
//     bodyParser: true,
//   },
// };
