import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    req: NextRequest, 
    { params }: { params: { examId: string } }
) {
    try {
        const session = await getCurrentUser();
        
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        
        const { choices } = await req.json();

        if (!Array.isArray(choices) || choices.length === 0) {
            return new NextResponse("Invalid choices", { status: 400 });
        }

        // Check if the user already has a result for this exam
        const existingResult = await db.userExamResult.findUnique({
            where: {
                userId_examId: {
                    userId: session?.user.id,
                    examId: params.examId,
                },
            },
        });

        if (existingResult) {
            return new NextResponse("Result already exists", { status: 400 });
        }

        // Fetch the exam questions and correct answers
        const exam = await db.exam.findUnique({
            where: { id: params.examId },
            include: {
                questions: {
                    include: {
                        choices: true,
                    },
                },
            },
        });

        if (!exam) {
            return new NextResponse("Exam not found", { status: 404 });
        }

        // Calculate the marks
        let marks = 0;
        for (const question of exam.questions) {
            const correctChoice = question.choices.find(choice => choice.isCorrect);
            const userChoice = choices.find(choice => choice.questionId === question.id);

            if (userChoice && userChoice.choiceId === correctChoice?.id) {
                marks += 1; // Increment marks for each correct answer
            }
        }

        // Create the new result
        const result = await db.userExamResult.create({
            data: {
                userId: session?.user.id,
                examId: params.examId,
                marks,
            },
        });

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("[USER_EXAM_RESULT_CREATE]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
