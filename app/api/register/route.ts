import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import argon2 from 'argon2';
import { db } from '@/lib/db';

// Define Zod schema for validation
const userSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6).optional(),
  phone_number: z.string().optional(),
  profile_picture: z.string().optional(),
  stage: z.string().optional(),
  stage_2: z.string().optional(),
  role: z.string().optional(),
  parents_phone_number: z.string().optional(),
  subject: z.string().optional(),
});

type UserSchema = z.infer<typeof userSchema>;

export async function POST(req: NextRequest) {
  try {
    // Parse and validate the request body
    const body = await req.json();
    const parsedBody: UserSchema = userSchema.parse(body);

    const { 
      first_name, 
      last_name, 
      email, 
      password, 
      confirmPassword, 
      phone_number, 
      profile_picture, 
      stage, 
      stage_2, 
      role, 
      parents_phone_number, 
      subject 
    } = parsedBody;

    // Check if the email is already in use
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email is already in use.' }, { status: 409 });
    }

    // Hash the password using Argon2
    const hashedPassword = await argon2.hash(password);

    // Prepare user data with optional fields
    const userData: {
      first_name: string;
      last_name: string;
      email: string;
      password: string;
      phone_number?: string | null;
      profile_picture?: string | null;
      stage?: string | null;
      stage_2?: string | null;
      role?: string | null;
      parents_phone_number?: string | null;
      subject?: string | null;
    } = {
      first_name,
      last_name,
      email,
      password: hashedPassword,
      phone_number: phone_number || null,
      profile_picture: profile_picture || null,
      stage: stage || null,
      stage_2: stage_2 || null,
      role: role || null,
      parents_phone_number: parents_phone_number || null,
      subject: subject || null,
    };

    // Save the user to the database
    const user = await db.user.create({
      data: userData as any, // Use 'as any' if type assertion is needed
    });

    // Send a success response
    return NextResponse.json({ message: 'Account created successfully!', user }, { status: 201 });
  } catch (err) {
    console.error('Error creating user:', err);
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation Error', details: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await db.$disconnect();
  }
}
