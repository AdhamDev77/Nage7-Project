import { db } from "@/lib/db";
import React from "react";
import Categories from "./_components/categories";
import SearchInput from "@/components/search-input";
import getCourses from "@/actions/get-courses";
import CoursesList from "@/components/courses-list";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";

type SearchParams = {
  title: string;
  categoryId: string;
};

type Props = {
  searchParams: SearchParams;
};

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

const Search = async ({ searchParams }: Props) => {
  // Fetch session on the server side
  const session = await getCurrentUser();

  // Log session for debugging
  console.log('Session:', session);

  // If there is no session, handle this case accordingly
  if (!session?.user) {
    redirect("/");
    return null; // Ensure the function returns null if redirection happens
  }

  const userId = session.user.id;

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const courses = await getCourses({
    userId,
    ...searchParams,
  });

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Categories items={categories} />
        <CoursesList items={courses as unknown as CourseWithProgressWithCategory[]} />
      </div>
    </>
  );
};

// Define dynamic segments for the page, if needed
export async function generateMetadata({ searchParams }: { searchParams: SearchParams }) {
  return {
    title: `Search Results for ${searchParams.title}`,
  };
}

export default Search;
