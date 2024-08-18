"use client";

import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

type Props = {
  courseId: string;
  chapterId: string;
  nextChapterId?: string;
  isCompleted?: boolean;
};

const CourseEnrollButton = ({
  courseId,
  chapterId,
  nextChapterId,
  isCompleted: initialIsCompleted,
}: Props) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isCompleted, setIsCompleted] = useState(initialIsCompleted || false);
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      await axios.put(
        `/api/courses/${courseId}/chapters/${chapterId}/progress`,
        {
          isCompleted: !isCompleted,
        }
      );
      setIsCompleted(!isCompleted);

      if (!isCompleted && !nextChapterId) {
        confetti.onOpen();
      }

      if (!isCompleted && nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      }
      router.refresh()
    } catch {
      toast.error("حدث خطأ");
    } finally {
      setIsLoading(false);
    }
  };

  const IconComponent = isCompleted ? XCircle : CheckCircle;

  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      className="w-full md:w-auto"
      type="button"
      variant={isCompleted ? "outline" : "success"}
    >
      {isCompleted ? "غير مكتمل" : "وضع علامة مكتمل"}
      <IconComponent className="h-4 w-4 mr-2" />
    </Button>
  );
};

export default CourseEnrollButton;
