"use client";
import React from "react";
import { CheckCircle, Lock, Newspaper, PlayCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  id: string;
  courseId: string;
  isCompleted: boolean;
  isLocked: boolean;
  chapterId: string;
};

const CourseSidebarExam: React.FC<Props> = ({
  id,
  courseId,
  label,
  isCompleted,
  isLocked,
  chapterId,
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const Icon = isLocked ? Lock : isCompleted ? CheckCircle : Newspaper;

  const isActive = pathname?.includes(`${chapterId}/exam`);

  const onClick = async () => {
    router.push(`/courses/${courseId}/chapters/${chapterId}/exam`);
  };

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "flex items-center gap-x-2 text-slate-500 text-sm font-[500] pr-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
        isActive && "text-slate-700 bg-slate-200/20 hover:bg-slate-200/20 hover:text-slate-700",
        isCompleted && "text-emerald-700 hover:text-emerald-700",
        isCompleted && isActive && "bg-emerald-200/20"
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          size={22}
          className={cn(
            "text-slate-500",
            isActive && "text-slate-700",
            isCompleted && "text-emerald-700"
          )}
        />
        امتحان {label} 
      </div>
      <div
        className={cn(
          "mr-auto opacity-0 border-2 border-slate-700 h-full transition-all",
          isActive && "opacity-100",
          isCompleted && "border-emerald-700"
        )}
      />
    </button>
  );
};

export default CourseSidebarExam;
