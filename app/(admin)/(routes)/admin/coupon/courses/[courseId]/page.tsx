import { Button } from "@/components/ui/button";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

type Props = {}

const pages = async ({
  params,
}: {
  params: { courseId: string };
}) => {
  const { userId } = auth();
  if (userId !== process.env.ADMIN_USERID) {
    return redirect("/signin");
  }
  const chapters = await db.chapter.findMany({
    where: {
      courseId: params.courseId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className=" p-6">
      <DataTable columns={columns} data={chapters} />
    </div>
  );
};

export default pages