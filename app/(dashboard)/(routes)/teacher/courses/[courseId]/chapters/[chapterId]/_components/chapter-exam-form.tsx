"use client";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import axios from "axios";
import { Pen, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type Props = {
  initialData: {
    title: string;
  };
  courseId: string;
  chapterId: string;
  numberOfQuestions: number | null;
  examId: String | undefined;
};

const ChapterTitleForm = ({
  initialData,
  courseId,
  chapterId,
  numberOfQuestions,
  examId
}: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCreateExam = async () => {
    setLoading(true);
    try {
      // Create a new exam associated with the chapter
      const response = await axios.post(
        `/api/courses/${courseId}/chapters/${chapterId}/exam`
      );

      // Redirect to the new exam page
      router.push(
        `/teacher/courses/${courseId}/chapters/${chapterId}/exam/${response.data.id}`
      );
    } catch (error) {
      console.error("Failed to create exam:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-6 flex justify-between items-center">
      {numberOfQuestions && numberOfQuestions > 0 ? (
        <p className="">الامتحان يتكون من {numberOfQuestions} أسئلة</p>
      ) : (
        <p className="">لا يوجد امتحان لهذة الحصة بعد</p>
      )}

      {numberOfQuestions ? (
        <>
          <Link href={`/teacher/courses/${courseId}/chapters/${chapterId}/exam/${examId}`} className="flex gap-2 text-sm">
            <Button className="flex gap-2 text-sm">
               تعديل <Pen className="w-4 h-4" />
            </Button>
          </Link>
        </>
      ) : (
        <Button onClick={handleCreateExam} className="flex gap-2 text-sm">
          {loading ? (
            <>جاري الانشاء ...</>
          ) : (
            <>
              امتحان جديد <Plus className="w-4 h-4" />
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default ChapterTitleForm;
