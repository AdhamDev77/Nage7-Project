"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import MuxPlayer from "@mux/mux-player-react"
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ImageIcon, Pencil, PlusCircle, Video } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Chapter, MuxData } from "@prisma/client";
import Image from "next/image";
import { FileUpload } from "@/components/file-upload";

interface ChapteVideoFormProps {
  initialData: Chapter & { muxData?: MuxData | null };
  courseId: string;
  chapterId: string;
}

const ChapteVideoForm: React.FC<ChapteVideoFormProps> = ({
  initialData,
  courseId,
  chapterId,
}) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => {
    setIsEditing((current) => !current);
  };

  const formSchema = z.object({
    videoUrl: z.string().min(1, {
      message: "يجب رفع فيديو واحد على الأقل",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { videoUrl: initialData?.videoUrl || "" },
  });

  const { isSubmitting, isValid } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Submitting form with values:", values);
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
      toast.success("تم رفع الفيديو");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to update the course", error);
      toast.error("حدث خطأ");
    }
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-6">
      <div className="font-medium flex items-center justify-between">
        فيديو الحصة
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            <>إلغاء</>
          ) : initialData.videoUrl ? (
            <>
              <Pencil className="h-4 w-4 ml-2" />
              تعديل الفيديو
            </>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 ml-2" />
              أضف فيديو
            </>
          )}
        </Button>
      </div>
      {isEditing ? (
        <div>
          <FileUpload
            endpoint="courseVideo"
            onChange={async (url) => {
              console.log("File uploaded, received URL:", url);
              if (url) {
                try {
                  await onSubmit({ videoUrl: url });
                } catch (error) {
                  console.error("Error during form submission:", error);
                }
              } else {
                console.error("No URL returned from upload");
                toast.error("Failed to get upload URL");
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            ارفع المقاطع الخاصة بهذا الحصة
          </div>
        </div>
      ) : initialData.videoUrl ? (
        <div className="relative aspect-video mt-2">
          <MuxPlayer
          playbackId={initialData?.muxData?.playbackId || ""}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
          <Video className="h-10 w-10 text-slate-500" />
        </div>
      )}
      {initialData.videoUrl && !isEditing && (
        <div className=" text-xs text-muted-foreground mt-2">
          من الممكن يأخد الفيديو بضع دقائق حتي يظهر. حدث الصفحة اذا لم يظهر
          الفيديو
        </div>
      )}
    </div>
  );
};

export default ChapteVideoForm;
