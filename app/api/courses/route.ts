import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const { title } = await req.json();
    
    const course = await db.course.create({
      data: {
        userId: session?.user.id,
        title
      }
    });
    
    return NextResponse.json(course, { status: 200 });
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
