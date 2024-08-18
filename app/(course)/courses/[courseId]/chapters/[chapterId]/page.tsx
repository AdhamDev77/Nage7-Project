"use client";

import React, { useEffect, useState } from "react";
import getChapter from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { useRouter } from "next/navigation";
import VideoPlayer from "./_components/video-player";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { File } from "lucide-react";
import CourseProgressButton from "./_components/course-progress-button";
import ChapterEnrollButton from "./_components/chapter-enroll-button";
import Spinner from "@/components/ui/spinner";
import { useSession } from "next-auth/react";

interface Params {
  courseId: string;
  chapterId: string;
}

interface ChapterIdPageProps {
  params: Params;
}

interface Chapter {
  id: string | null;
  title: string | null;
  description: string | null;
  isFree: boolean;
  price: number | null;
}

interface Course {
  id: string;
  title: string;
}

interface MuxData {
  playbackId: string | null;
}

interface Attachment {
  id: string;
  name: string;
  url: string;
}

interface UserProgress {
  isCompleted: boolean;
}

interface Purchase {
  id: string;
}

interface Coupon {
  id: string;
}

interface Exam {
  id: string;
}

const ChapterIdPage: React.FC<ChapterIdPageProps> = ({ params }) => {
  const [data, setData] = useState<{
    chapter: Chapter;
    course: Course | null;
    muxData: MuxData | null;
    attachments: Attachment[];
    nextChapter: Chapter | null;
    userProgress: UserProgress | null;
    purchase: Purchase | null;
    coupon: Coupon | null;
    exam: Exam | null;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(true);

  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user?.id) {
      router.push("/signin");
      return;
    }

    fetchData();
  }, [params.courseId, params.chapterId, router, session?.user?.id]);

  const fetchData = async () => {
    try {
      const result = await getChapter({
        userId: session?.user?.id || "",
        courseId: params.courseId,
        chapterId: params.chapterId,
      });
  
      if (!result.chapter) {
        throw new Error("Chapter not found");
      }

      // Destructure the exam from chapter
      const { exam, ...chapterData } = result.chapter;

      // Set the state with the correct structure
      setData({
        chapter: chapterData,
        course: result.course,
        muxData: result.muxData,
        attachments: result.attachments,
        nextChapter: result.nextChapter,
        userProgress: result.userProgress,
        purchase: result.purchase,
        coupon: result.coupon,
        exam: exam || null,  // Handle exam as possibly null
      });
  
      setIsLocked(
        !result.chapter.isFree && !result.purchase && !result.coupon
      );
    } catch (error) {
      console.error("Error fetching chapter data:", error);
      setError("Error loading data.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!data) {
    return <div>No data available.</div>;
  }

  const {
    chapter,
    muxData,
    attachments,
    nextChapter,
    userProgress,
    purchase,
    coupon,
    exam,
  } = data;

  const completeOnEnd =
    (purchase || coupon) && !userProgress?.isCompleted;

  return (
    <div>
      {isLocked && (
        <Banner
          variant="warning"
          label="يجب شراء هذة المجموعة لمشاهدة هذا الحصة"
        />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={params.chapterId}
            title={chapter.title || ""}
            courseId={params.courseId}
            nextChapterId={nextChapter?.id || undefined}
            playbackId={muxData?.playbackId || undefined}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd || true}
            exam={exam || {}}
          />
        </div>
        <div className="p-4 flex flex-col md:flex-row items-center justify-between">
          <h2 className="text-xl font-semibold mb-3">{chapter.title || "Untitled"}</h2>
          {purchase || chapter.isFree || coupon ? (
            <CourseProgressButton
              chapterId={params.chapterId}
              courseId={params.courseId}
              nextChapterId={nextChapter?.id || undefined}
              isCompleted={!!userProgress?.isCompleted}
            />
          ) : (
            <ChapterEnrollButton
              chapterId={params.chapterId}
              price={chapter.price || 0}
              setIsLocked={setIsLocked}
              fetchChapterData={fetchData} // Pass the fetch function
            />
          )}
        </div>
        <Separator />
        <div>
          <Preview value={chapter.description || "No description available."} />
        </div>
        {attachments.length > 0 && (
          <>
            <Separator />
            <div className="p-4">
              {attachments.map((attachment) => (
                <a
                  className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline mb-2"
                  href={attachment.url}
                  target="_blank"
                  key={attachment.id}
                  rel="noopener noreferrer"
                >
                  <File className="mr-2" />
                  <p className="line-clamp-1">{attachment.name}</p>
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChapterIdPage;
