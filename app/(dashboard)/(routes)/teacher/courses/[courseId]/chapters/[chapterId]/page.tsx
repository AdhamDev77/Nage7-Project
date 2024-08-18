import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import {
  ArrowRight,
  CircleDollarSign,
  Eye,
  LayoutDashboard,
  Video,
  File,
  Newspaper,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import ChapterTitleForm from "./_components/chapter-title-form";
import ChapterDescriptionForm from "./_components/chapter-description-form";
import ChapterAccessForm from "./_components/chapter-access-form"; // Fixed typo
import ChapterVideoForm from "./_components/chapter-video-form";
import { Banner } from "@/components/banner";
import ChapterActions from "./_components/chapter-actions";
import AttachmentForm from "./_components/attachment-form";
import PriceForm from "./_components/price-form";
import ChapterExamForm from "./_components/chapter-exam-form";

const page = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {


  const chapter = await db.chapter.findUnique({
    where: {
      id: params.chapterId,
      courseId: params.courseId,
    },
    include: {
      muxData: true,
      attachments: true,
      exam: { // Ensure you include the exam and questions relation
        include: {
          questions: true,
        },
      },
    },
  });

  if (!chapter) {
    return redirect("/signin");
  }

  const requiredFields = [
    chapter.title,
    chapter.description,
    chapter.videoUrl,
    chapter.price,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!chapter.isPublished && (
        <Banner
          variant="warning"
          label="هذة الحصة غير منشورة. لن يكون ظاهر في المجموعة"
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/teacher/courses/${params.courseId}`}
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
            >
              <ArrowRight className="h-4 w-4 ml-2" />
              الرجوع لإعداد المجموعة
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-bold">إنشاء حصة</h1>
                <span className="text-sm text-slate-700">
                  أكمل جميع الحقول {completionText}
                </span>
              </div>
              <ChapterActions
                disabled={!isComplete}
                courseId={params.courseId}
                chapterId={params.chapterId}
                isPublished={chapter.isPublished}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">تخصيص الحصة ({chapter.title})</h2>
              </div>
              <ChapterTitleForm
                initialData={chapter}
                courseId={params.courseId}
                chapterId={params.chapterId}
              />
              <ChapterDescriptionForm
                initialData={chapter}
                courseId={params.courseId}
                chapterId={params.chapterId}
              />
              <div>
                <div className="flex items-center gap-x-2 mt-4">
                  <IconBadge icon={Eye} />
                  <h2 className="text-xl">إعدادات الوصول</h2>
                </div>
                <ChapterAccessForm
                  initialData={chapter}
                  courseId={params.courseId}
                  chapterId={params.chapterId}
                />
              </div>
              <div className="mt-6">
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={File} />
                  <h2 className="text-xl">موارد و مرفقات</h2>
                </div>
                <AttachmentForm
                  initialData={chapter}
                  courseId={params.courseId}
                  chapterId={params.chapterId}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-y-6">
            <div className="flex flex-col gap-y-2">
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl">بيع المجموعة</h2>
              </div>
              <PriceForm
                initialData={chapter}
                courseId={params.courseId}
                chapterId={params.chapterId}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Video} />
                <h2 className="text-xl">أضف فيديو</h2>
              </div>
              <ChapterVideoForm
                initialData={chapter}
                courseId={params.courseId}
                chapterId={params.chapterId}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Newspaper} />
                <h2 className="text-xl">إعداد الإمتحان</h2>
              </div>
              <ChapterExamForm
                initialData={chapter}
                courseId={params.courseId}
                chapterId={params.chapterId}
                numberOfQuestions={chapter.exam?.questions.length || 0} // Ensure this handles optional chaining
                examId={chapter.exam?.id} // Ensure this handles optional chaining
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
