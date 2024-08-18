import { db } from "@/lib/db";
import getProgress from "./get-progress";

// Define types for the course data structure
type CourseWithProgressWithCategory = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  isPublished: boolean;
  categoryId: string | null;
  createdAt: Date;
  progress: number | null;
  category: {
    id: string;
    name: string;
    createdAt: Date;
  } | null;
  chapters: {
    id: string;
    title: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
  }[];
};

type DashboardCourses = {
  completedCourses: CourseWithProgressWithCategory[];
  coursesInProgress: CourseWithProgressWithCategory[];
};

export const GetDashboardCourses = async (
  userId: string
): Promise<DashboardCourses> => {
  try {
    // Fetch all published courses
    const allCourses = await db.course.findMany({
      where: {
        isPublished: true,
      },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        isPublished: true,
        categoryId: true,
        createdAt: true,
        category: {
          select: {
            id: true,
            name: true,
            createdAt: true,
          },
        },
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
            title: true,
            description: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    // Calculate progress for each course
    const coursesWithProgress = await Promise.all(
      allCourses.map(async (course) => {
        const progress = await getProgress(userId, course.id);
        return {
          ...course,
          progress,
        };
      })
    );

    // Filter courses with at least 1% progress
    const coursesWithProgressAtLeast1 = coursesWithProgress.filter(
      (course) => course.progress !== null && course.progress > 0
    );

    // Separate completed courses from courses in progress
    const completedCourses = coursesWithProgressAtLeast1.filter(
      (course) => course.progress === 100
    );
    const coursesInProgress = coursesWithProgressAtLeast1.filter(
      (course) => course.progress !== 100
    );

    return {
      completedCourses,
      coursesInProgress,
    };
  } catch (error) {
    console.error("[GET_DASHBOARD_COURSES]", error);
    return {
      completedCourses: [],
      coursesInProgress: [],
    };
  }
};
