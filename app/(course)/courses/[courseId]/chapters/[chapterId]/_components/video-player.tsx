"use client";

import { useConfettiStore } from "@/hooks/use-confetti-store";
import { cn } from "@/lib/utils";
import MuxPlayer from "@mux/mux-player-react";
import axios from "axios";
import { Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

type Props = {
  chapterId: string;
  title: string;
  courseId: string;
  nextChapterId?: string;
  playbackId: string | null | undefined;
  isLocked: boolean;
  completeOnEnd: boolean;
  exam: object | {}
};

const VideoPlayer = ({
  chapterId,
  title,
  courseId,
  nextChapterId,
  playbackId,
  isLocked,
  completeOnEnd,
  exam
}: Props) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    console.log("playbackId:", playbackId);
  }, [playbackId]);

  const onEnd = async () => {
    try {
      if (completeOnEnd) {
        await axios.put(
          `/api/courses/${courseId}/chapters/${chapterId}/progress`,
          {
            isCompleted: true,
          }
        );
      }
      // if (!nextChapterId) {
      //   confetti.onOpen();
      // }
      // if (nextChapterId) {
      //   router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      // }
      if(exam){
        router.push(`/courses/${courseId}/chapters/${chapterId}/exam`)
      }else if (!exam && nextChapterId){
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
      }else {
        confetti.onOpen()
      }
      router.refresh();
    } catch {
      toast.error("حدث خطأ");
    }
  };

  return (
    <div className="relative aspect-video">
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
          <Lock className="h-8 w-8" />
          <p className="text-sm">لا يمكنك مشاهدة هذا الحصة</p>
        </div>
      )}
      {!isReady && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
        </div>
      )}
      {!isLocked && playbackId && (
        <MuxPlayer
          title={title}
          playbackId={playbackId}
          className={cn(!isReady && "hidden")}
          onCanPlay={() => {
            console.log("onCanPlay triggered");
            setIsReady(true);
          }}
          onEnded={onEnd}
          autoPlay
        />
      )}
    </div>
  );
};

export default VideoPlayer;
