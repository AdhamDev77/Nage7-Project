"use client";
import { BarChart, Book, BookA, BookCheck, BookCopy, BookOpen, Compass, Eye, Home, Layout, List, LogIn, MoreHorizontal, Phone, Sidebar, User, User2 } from "lucide-react";
import React from "react";
import SidebarItem from "./sidebarItem";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

type Props = {};
const visitorRoutes = [
  {
    icon: Home,
    label: "الرأيسية",
    href: "/",
  },
  {
    icon: BookOpen,
    label: "مجموعات",
    href: "/search",
  },
  {
    icon: User2,
    label: "مدربين",
    href: "/instructors",
  },
  {
    icon: Eye,
    label: "من نحن",
    href: "/aboutus",
  },
  {
    icon: Phone,
    label: "تواصل معنا",
    href: "/contact",
  },
  {
    icon: LogIn,
    label: "تسجيل",
    href: "/sign-in",
  },
];
const guestRoutes = [
  {
    icon: Layout,
    label: "لوحة المعلومات",
    href: "/dashboard",
  },
  {
    icon: Compass,
    label: "تصفح",
    href: "/search",
  },
];
const teacherRoutes = [
  {
    icon: List,
    label: "دروسي",
    href: "/teacher/courses",
  },
  {
    icon: BarChart,
    label: "احصاءات",
    href: "/teacher/analytics",
  },
];
const SidebarRoutes = (props: Props) => {
  const {data: session} = useSession()
  const pathname = usePathname();

  let routes = null;
  if (!session || !session.user) {
    routes = visitorRoutes;
  } else {
    const isTeacherPage = pathname?.includes("/teacher");
    routes = isTeacherPage ? teacherRoutes : guestRoutes;
  }

  return (
    <div className=" flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};

export default SidebarRoutes;
