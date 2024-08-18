import React from 'react';
import { Chapter, Course, UserProgress } from '@prisma/client';
import NavbarRoutes from '@/components/navbarRoutes';
import CourseMobileSidebar from './course_mobile-sidebar';

type CourseWithDetails = Course & {
  chapters: (Chapter & {
    userProgress: UserProgress[] | null;
  })[];
};

type Props = {
  course: CourseWithDetails;
  progressCount: number;
};

const CourseNavbar: React.FC<Props> = ({ course, progressCount }) => {
  return (
    <div className="p-4 border-b h-full flex items-center justify-between shadow-sm z-50 backdrop-blur-md bg-white/60">
      <CourseMobileSidebar course={course} progressCount={progressCount} />
      <NavbarRoutes />
    </div>
  );
};

export default CourseNavbar;
