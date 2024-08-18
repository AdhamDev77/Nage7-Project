import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { chapterId: string } }
) {
  try {
    const session = await getCurrentUser();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Create an exam associated with the chapterId
    const exam = await db.exam.create({
      data: {
        chapterId: params.chapterId,
        // Add other fields required for the exam creation
      },
    });

    return NextResponse.json(exam, { status: 200 });
  } catch (error) {
    console.error("[CREATE_EXAM]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { chapterId: string } } // Corrected to examId
) {
  try {
    const session = await getCurrentUser();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch exam data based on examId
    const exam = await db.exam.findUnique({
      where: {
        chapterId: params.chapterId,
      },
      include: {
        chapter: {
          include: {
            course: true, // Include course if needed
          },
        },
        questions: {
          include: {
            choices: true,
          },
        },
        UserExamResults: true,
      },
    });

    if (!exam) {
      return new NextResponse("Exam not found", { status: 404 });
    }

    // Fetch existing user exam result
    const existingResult = await db.userExamResult.findUnique({
      where: {
        userId_examId: {
          userId: session?.user.id,
          examId: exam.id,
        },
      },
    });

    // Return exam data and user exam result
    return NextResponse.json({ exam, existingResult }, { status: 200 });
  } catch (error) {
    console.error("[EXAM_FETCH_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
