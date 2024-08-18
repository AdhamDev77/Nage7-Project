import { db } from "@/lib/db";
import React from "react";
import Categories from "./_components/categories";
import SearchInput from "@/components/search-input";
import getCourses from "@/actions/get-courses";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CoursesList from "@/components/courses-list";

type SearchParams = {
  title: string;
  categoryId: string;
};

type Props = {
  searchParams: SearchParams;
};


const Search = async ({ searchParams }: Props) => {
  const { userId } = auth();

  if (userId !== process.env.ADMIN_USERID) {
    return redirect("/signin");
  }

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const courses = await getCourses({
    userId,
    ...searchParams,
  });

  console.log(courses)

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

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Categories items={categories} />
        <CoursesList items={courses as unknown as CourseWithProgressWithCategory[]} />=
      </div>
    </>
  );
};

export default Search;
