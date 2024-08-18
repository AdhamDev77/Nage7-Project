import React from "react";
import CourseSidebarItem from "./course-sidebar-item";
import CourseSidebarExam from "./course-sidebar-exam";
import {
  Chapter,
  Course,
  UserProgress,
  Purchase,
  Coupon,
  Exam,
  UserExamResult,
} from "@prisma/client";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import CourseProgress from "@/components/course-progress";

type CourseWithDetails = Course & {
  chapters: (Chapter & {
    userProgress?: UserProgress[] | null;
    purchase?: Purchase[] | null;
    exam?: (Exam & {
      UserExamResults?: UserExamResult[] | null;
    }) | null;
  })[];
};

type CourseSidebarProps = {
  course: CourseWithDetails | undefined;
  progressCount: number | null;
};

const CourseSidebar: React.FC<CourseSidebarProps> = async ({
  course,
  progressCount,
}) => {
  const session = await getCurrentUser();

  if (!course) {
    return <div>معلومات المجموعة غير متاحة</div>;
  }

  const userCoupons = await db.coupon.findMany({
    where: { userId: session?.user?.id, isUsed: true },
  });

  return (
    <div className="h-full border-l flex flex-col overflow-y-auto shadow-sm">
      <div className="p-8 flex flex-col border-b">
        <h1 className="font-bold">{course.title}</h1>
        <div className="mt-10">
          {progressCount !== null && (
            <CourseProgress variant="success" value={progressCount} />
          )}
        </div>
      </div>
      <div className="flex flex-col w-full">
        {course.chapters.map((chapter) => {
          const isPurchased = chapter.purchase?.some(
            (p) => p.userId === session?.user?.id
          );
          const hasCoupon = userCoupons.some(
            (coupon) => coupon.chapterId === chapter.id
          );

          const isExamCompleted = chapter.exam?.UserExamResults?.some(
            (result) => result.userId === session?.user?.id
          ) ?? false;

          return (
            <React.Fragment key={chapter.id}>
              <CourseSidebarItem
                id={chapter.id}
                label={chapter.title}
                isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
                courseId={course.id}
                isLocked={!chapter.isFree && !isPurchased && !hasCoupon}
              />

              {chapter.exam && (
                <CourseSidebarExam
                  id={chapter.exam.id}
                  chapterId={chapter.id}
                  label={chapter.title}
                  isCompleted={isExamCompleted}
                  courseId={course.id}
                  isLocked={!chapter.isFree && !isPurchased && !hasCoupon}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default CourseSidebar;
