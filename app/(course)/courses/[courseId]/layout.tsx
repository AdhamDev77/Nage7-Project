import getProgress from "@/actions/get-progress";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import CourseSidebar from "./_components/course-sidebar";
import CourseNavbar from "./_components/course-navbar";
import { getCurrentUser } from "@/lib/session";

type CourseLayoutProps = {
  children: React.ReactNode;
  params: { courseId: string };
};

const CourseLayout = async ({ children, params }: CourseLayoutProps) => {
  const session = await getCurrentUser();

  if (!session?.user?.id) {
    // Handle case where session is not available
    return redirect("/signin");
  }

  try {
    const course = await db.course.findUnique({
      where: { id: params.courseId },
      include: {
        chapters: {
          where: { isPublished: true },
          include: {
            userProgress: {
              where: { userId: session.user.id },
            },
            exam: {
              include: {
                UserExamResults: {
                  where: { userId: session.user.id },
                },
              },
            },
          },
          orderBy: { position: "asc" },
        },
      },
    });

    if (!course) {
      return redirect("/signin");
    }

    // Correctly call getProgress
    const progressCount = await getProgress(session.user.id, course.id);

    return (
      <div className="h-full">
        <div className="h-[80px] md:pr-80 fixed inset-y-0 w-full z-50">
          <CourseNavbar course={course} progressCount={progressCount} />
        </div>
        <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
          <CourseSidebar course={course} progressCount={progressCount} />
        </div>
        <main className="md:pr-80 h-full pt-[80px]">{children}</main>
      </div>
    );
  } catch (error) {
    console.error("Error fetching course:", error);
    return redirect("/signin");
  }
};

export default CourseLayout;
