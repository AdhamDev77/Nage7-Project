import React from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import CourseSidebar from "./course-sidebar";
import { Chapter, Course, UserProgress } from "@prisma/client";

type CourseWithDetails = Course & {
  chapters: (Chapter & {
    userProgress?: UserProgress[] | null;
  })[];
};

type CourseMobileSidebarProps = {
  course?: CourseWithDetails; // Make course optional to handle undefined
  progressCount?: number | null; // Allow progressCount to be optional
};

const CourseMobileSidebar: React.FC<CourseMobileSidebarProps> = ({
  course,
  progressCount,
}) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pl-4 hover:opacity-75 transition">
        <Menu />
      </SheetTrigger>
      <SheetContent side="right" className="p-0 bg-white w-72">
        {course && (
          <CourseSidebar course={course} progressCount={progressCount ?? 0} />
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CourseMobileSidebar;
