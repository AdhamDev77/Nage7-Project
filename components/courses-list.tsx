// src/components/courses-list.tsx
import React from "react";
import CourseCard from "./course-card";
import { Category, Course } from "@prisma/client";

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

type Props = {
  items: CourseWithProgressWithCategory[];
};

const CoursesList: React.FC<Props> = ({ items }) => {
  return (
    <>
      {items && items.length > 0 ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id}>
              <CourseCard
                id={item.id}
                title={item.title}
                imageUrl={item.imageUrl || ''} // Provide a default value if imageUrl is null
                chaptersLength={item.chapters.length}
                progress={item.progress}
                category={item.category?.name || 'غير مصنف'} // Default to 'غير مصنف' if category is null
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-sm text-muted-foreground mt-10">
          لا يوجد مجموعات تتابعها
        </div>
      )}
    </>
  );
};

export default CoursesList;
