"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import React from "react";
import { Button } from "./ui/button";
import { LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import SearchInput from "./search-input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Logo from "@/app/(dashboard)/_components/logo";

const NavbarRoutes: React.FC = () => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isCoursePage = pathname?.includes("/courses");
  const isSearchPage = pathname === "/search";

  const { data: session } = useSession();

  const NavMenu = () => (
    <DropdownMenuContent>
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {session && session.user ? (
        <>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => signOut()}
          >
            Sign out
          </DropdownMenuItem>
        </>
      ) : (
        <DropdownMenuItem>
          <Link className="" href="/signin">
            Sign in
          </Link>
        </DropdownMenuItem>
      )}
    </DropdownMenuContent>
  );

  const getInitials = (
    firstName: string | undefined,
    lastName: string | undefined
  ): string => {
    const capitalizeFirstLetter = (string: string | undefined): string => {
      if (!string) return "";
      return string.charAt(0).toUpperCase();
    };

    return `${capitalizeFirstLetter(firstName)}${capitalizeFirstLetter(
      lastName
    )}`;
  };

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="w-auto md:w-full flex justify-between align-center">
        {!session || !session.user ? (
          <>
            <div>
              <Logo />
            </div>
            <div className="hidden md:flex gap-x-10 items-center mr-20">
              <Link
                className="font-semibold text-slate-600 hover:text-slate-900"
                href="/"
              >
                الرئيسية
              </Link>
              <Link
                className="font-semibold text-slate-600 hover:text-slate-900"
                href="/search"
              >
                مجموعات
              </Link>
              <Link
                className="font-semibold text-slate-600 hover:text-slate-900"
                href="/instructors"
              >
                مدربين
              </Link>
              <Link
                className="font-semibold text-slate-600 hover:text-slate-900"
                href="/aboutus"
              >
                من نحن
              </Link>
            </div>
          </>
        ) : null}
        <div className="md:flex hidden items-center gap-x-2 mr-auto">
          {session && session.user && (
            <>
              {isTeacherPage || isCoursePage ? (
                <Link href="/">
                  <Button>
                    <LogOut className="h-4 w-4 ml-2" />
                    خروج
                  </Button>
                </Link>
              ) : session.user.role === "teacher" ? (
                <Link href="/teacher/courses">
                  <Button size="sm" variant="ghost">
                    نظام المعلم
                  </Button>
                </Link>
              ) : null}
            </>
          )}
          <Button variant="outline" size="sm">
            <Link
              className="text-slate-600 hover:text-slate-900"
              href="/contact"
            >
              تواصل معنا
            </Link>
          </Button>
          {session && session.user && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage
                    src={session?.user?.profile_picture || "defaultAvatar.png"}
                  />
                  <AvatarFallback className="bg-blue-500 text-white">
                    {getInitials(
                      session?.user?.first_name,
                      session?.user?.last_name
                    )}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <NavMenu />
            </DropdownMenu>
          )}
        </div>
      </div>
    </>
  );
};

export default NavbarRoutes;
