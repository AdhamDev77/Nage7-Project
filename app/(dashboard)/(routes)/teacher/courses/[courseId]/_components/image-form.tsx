"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Course } from "@prisma/client";
import Image from "next/image";
import { FileUpload } from "@/components/file-upload";

interface ImageFormProps {
  initialData: Course;
  courseId: string;
}

const ImageForm: React.FC<ImageFormProps> = ({ initialData, courseId }) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => {
    setIsEditing((current) => !current);
  };

  const formSchema = z.object({
    imageUrl: z.string().min(1, {
      message: "الصورة مطلوبة",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { imageUrl: initialData?.imageUrl || "" },
  });

  const { isSubmitting, isValid } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Submitting form with values:", values);
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("تم تحديث معلومات المجموعة");
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
        صورة المجموعة
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing && <>إلغاء</>}
          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircle className="h-4 w-4 ml-2" />
              أضف صورة
            </>
          )}
          {!isEditing && initialData.imageUrl && (
            <>
              <Pencil className="h-4 w-4 ml-2" />
              تعديل الصورة
            </>
          )}
        </Button>
      </div>
      {isEditing ? (
        <div>
          <FileUpload
            endpoint="courseImage"
            onChange={async (url) => {
              console.log("File uploaded, received URL:", url);
              if (url) {
                try {
                  await onSubmit({ imageUrl: url });
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
            ننصح باستخدام نسبة العرض إلى الارتفاع 16:9
          </div>
        </div>
      ) : initialData.imageUrl ? (
        <div className="relative aspect-video mt-2">
          <Image
            alt="ارفع"
            fill
            className="object-cover rounded-md"
            src={initialData.imageUrl}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
          <ImageIcon className="h-10 w-10 text-slate-500" />
        </div>
      )}
    </div>
  );
};

export default ImageForm;
