import { db } from "@/lib/db";



type AnalyticsData = {
  data: Array<{ label: string; value: number }>;
  totalRevenue: number;
  totalSales: number;
};

export const getAnalytics = async (userId: string, chapterId?: string, chapterPrice?: number | null): Promise<AnalyticsData> => {
  
  const purchasedChapters = await db.purchase.count({
    where: {
      chapterId
    },
  });

  const couponsUnlocked = await db.coupon.count({
    where: {
      isUsed: true,
      chapterId
    },
  });

  const totalSales = purchasedChapters + couponsUnlocked;

  const data = [
    { label: "Purchased Chapters", value: purchasedChapters },
    { label: "Coupons Unlocked", value: couponsUnlocked },
  ];

  return {
    data,
    totalSales,
    totalRevenue: totalSales * chapterPrice!,
  };
};
