import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

type Choice = {
  text: string;
  isCorrect: boolean;
};

type Question = {
  text: string;
  imageUrl?: string;
  choices: Choice[];
};

type EditExamRequest = {
  examId: string;
  questions: Question[];
};

export async function GET(
  req: NextRequest,
  { params }: { params: { examId: string } }
) {
  try {
    const session = await getCurrentUser();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch exam data
    const exam = await db.exam.findUnique({
      where: {
        id: params.examId,
      },
      include: {
        questions: {
          include: {
            choices: true, // Include choices for each question
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


export async function POST(req: NextRequest) {
    try {
      const session = await getCurrentUser();

        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Parse request body
        const { examId, questions }: EditExamRequest = await req.json();

        if (!examId || !Array.isArray(questions)) {
            return new NextResponse("Invalid input", { status: 400 });
        }

        // Validate questions format
        // for (const question of questions) {
        //     if (!question.text || !Array.isArray(question.choices) || question.choices.length !== 4) {
        //         return new NextResponse("Invalid question format", { status: 400 });
        //     }

        //     const correctChoices = question.choices.filter(choice => choice.isCorrect);
        //     if (correctChoices.length !== 1) {
        //         return new NextResponse("Exactly one correct choice is required per question", { status: 400 });
        //     }
        // }

        // Start transaction
            // Find the exam to update
            const exam = await db.exam.findUnique({
                where: { id: examId },
            });

            if (!exam) {
                throw new Error("Exam not found");
            }

            // Delete existing questions
            await db.question.deleteMany({
                where: { examId: examId },
            });

            // Insert new questions and choices
            for (const question of questions) {
                const createdQuestion = await db.question.create({
                    data: {
                        examId: examId,
                        text: question.text,
                        imageUrl: question.imageUrl || null,
                    },
                });

                for (const choice of question.choices) {
                    await db.choice.create({
                        data: {
                            questionId: createdQuestion.id,
                            text: choice.text,
                            isCorrect: choice.isCorrect,
                        },
                    });
                }
            }

        return new NextResponse("Exam updated successfully", { status: 200 });
    } catch (error) {
        console.error("[EXAM_UPDATE_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
