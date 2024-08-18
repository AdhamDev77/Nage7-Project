import { getAnalytics } from "@/actions/get-analytics";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import DataCard from "./_components/data-card";
import { Chart } from "./_components/chart";
import { db } from "@/lib/db"; // Adjust the path to your db instance
import { Separator } from "@/components/ui/separator";
import { getCurrentUser } from "@/lib/session";

type Props = {};

const Analytics: React.FC<Props> = async (props: Props) => {
  const session = await getCurrentUser();

  if (!session?.user?.id) {
    // Handle the case where user ID is not available
    return <div>User not authenticated</div>;
  }

  const courses = await db.course.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      chapters: true,
    },
  });

  const analyticsPromises = courses.flatMap((course) =>
    course.chapters.map((chapter) =>
      getAnalytics(session.user.id, chapter.id, chapter.price)
    )
  );

  const analyticsResults = await Promise.all(analyticsPromises);

  return (
    <div className="p-6">
      {courses.map((course) => (
        <div key={course.id} className="mb-6">
          <h2 className="text-3xl mb-4 py-4">احصائيات مجموعة <span className="font-bold">{course.title}</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {course.chapters.map((chapter, chapterIndex) => {
              const { data, totalRevenue, totalSales } = analyticsResults[course.chapters.findIndex(ch => ch.id === chapter.id)];
              return (
                <div key={chapter.id} className="mb-6 bg-slate-100 p-4 rounded-lg">
                  <h3 className="text-lg text-center mb-2">{chapter.title}</h3>
                  <Separator className="mb-4" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <DataCard value={totalSales} label="اِجمالي المبيعات" isMoney={false} />
                    <DataCard value={totalRevenue} label="اِجمالي الإيرادات" isMoney={true} />
                  </div>
                  <Chart data={data} />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Analytics;
