// src/app/dashboard/page.tsx
import { GetDashboardCourses } from "@/actions/get-dashboard-courses";
import CoursesList from "@/components/courses-list";
import { CheckCircle, Clock } from "lucide-react";
import { redirect } from "next/navigation";
import InfoCard from "../(root)/_components/info-card";
import { getCurrentUser } from "@/lib/session";


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

export default async function Dashboard() {
  const session = await getCurrentUser();

  if (!session?.user) {
    redirect("/signin");
    return;
  }

  const { completedCourses, coursesInProgress } = await GetDashboardCourses(session?.user.id);

  // Ensure the combinedCourses array matches the expected type
  const combinedCourses: CourseWithProgressWithCategory[] = [
    ...coursesInProgress || [],
    ...completedCourses || []
  ];

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard icon={Clock} label="جاري المتابعة" numberOfItems={coursesInProgress?.length || 0} />
        <InfoCard variant='success' icon={CheckCircle} label="تم اِكمال" numberOfItems={completedCourses?.length || 0} />
      </div>
      <CoursesList items={combinedCourses} />
    </div>
  );
}
