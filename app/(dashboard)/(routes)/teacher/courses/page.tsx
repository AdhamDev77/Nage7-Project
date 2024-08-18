import { Button } from "@/components/ui/button";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";


type Props = {};

const Courses = async (props: Props) => {
  const session = await getCurrentUser();

  const courses = await db.course.findMany({
    where: {
      userId: session?.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: { chapters: true },
  });
  return (
    <div className=" p-6">
      <DataTable columns={columns} data={courses} />
    </div>
  );
};

export default Courses;
