import { Button } from "@/components/ui/button";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { CheckCircle, Plus, Tag } from "lucide-react";
import React, { useState } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";
import { Input } from "@/components/ui/input";
import axios from "axios";
import CouponsGenerateButton from "./_components/coupons_generate_button";
import InfoCard from "./_components/info-card";

type Props = {};

const Pages = async ({ params }: { params: { chapterId: string } }) => {
  const { userId } = auth();
  if (userId !== process.env.ADMIN_USERID) {
    return redirect("/signin");
  }

  const coupons = await db.coupon.findMany({
    where: {
      chapterId: params.chapterId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const AvailableCoupons = await db.coupon.findMany({
    where: {
      chapterId: params.chapterId,
      isUsed: false,
    },
  });
  const usedCoupons = await db.coupon.findMany({
    where: {
      chapterId: params.chapterId,
      isUsed: true,
    },
  });

  const chapter = await db.chapter.findFirst({
    where: {
      id: params.chapterId,
    },
  });

  return (
    <div className="p-6">
      <CouponsGenerateButton
        chapterId={params.chapterId}
        chapterTitle={chapter?.title || "عنوان غير متوفر"}
      />

      <div className="flex gap-x-4 mt-6">
        <InfoCard
          variant="success"
          icon={Tag}
          label={"الكوبونات المتاحة"}
          numberOfItems={AvailableCoupons.length}
        />
        <InfoCard
          variant="default"
          icon={CheckCircle}
          label={"الكوبونات المستخدمة"}
          numberOfItems={usedCoupons.length}
        />
      </div>
      <DataTable columns={columns} data={coupons} />
    </div>
  );
};

export default Pages;
