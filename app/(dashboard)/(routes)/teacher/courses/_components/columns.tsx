"use client";

import { Button } from "@/components/ui/button";
import { Course, Chapter } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Define an interface that extends the Course type and adds chapters
interface CourseWithChapters extends Course {
  chapters: Chapter[];
}

export const columns: ColumnDef<CourseWithChapters>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          عنوان
          <ArrowUpDown className="mr-2 h-[14px] w-[14px]" />
        </Button>
      );
    },
  },
  {
    accessorKey: "chapters",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          عدد الحصص
          <ArrowUpDown className="mr-2 h-[14px] w-[14px]" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const chapters = row.original.chapters || [];
      return <div>{chapters.length}</div>;
    },
  },
  {
    accessorKey: "isPublished",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          الظهور
          <ArrowUpDown className="mr-2 h-[14px] w-[14px]" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isPublished = row.getValue("isPublished") as boolean;
      return (
        <Badge className={cn("bg-sky-700", !isPublished && "bg-slate-500")}>
          {isPublished ? "جاهز" : "غير جاهز"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="h-4 w-8 p-0 cursor-pointer flex items-center justify-center">
              <span className="sr-only">فتح القائمة</span>
              <MoreHorizontal className="h-4 w-4" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Link
                className="flex w-full justify-end align-end"
                href={`/teacher/courses/${id}`}
              >
                تعديل
                <Pencil className="h-4 w-4 ml-2" />
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
