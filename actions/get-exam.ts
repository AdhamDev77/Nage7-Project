import { db } from "@/lib/db";

interface GetExamProps {
  chapterId: string;
  userId: string;
}

const getExam = async ({ chapterId, userId }: GetExamProps) => {
  try {
    // Fetch the exam with questions and choices
    const exam = await db.exam.findUnique({
      where: {
        chapterId: chapterId, // Ensure this is using chapterId correctly
      },
      include: {
        questions: {
          include: {
            choices: true,
          },
        },
      },
    });

    // Check if the exam exists
    if (!exam) {
      throw new Error("Exam not found");
    }

    // Fetch the existing result for the user


    // Fetch the chapter for additional context
    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
      },
    });

    // Return both exam and chapter details
    return {
      exam,
      title: chapter?.title,
    };
  } catch (error) {
    console.error("[GET_EXAM]", error);
    return null;
  }
};

export default getExam;
