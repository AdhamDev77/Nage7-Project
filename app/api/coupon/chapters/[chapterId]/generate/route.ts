import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface CouponRequest extends NextRequest {
  json: () => Promise<{ numOfCoupons: number }>;
}

export async function POST(req: CouponRequest, { params }: { params: { chapterId: string } }) {
  const { numOfCoupons } = await req.json();

  function generateUniqueCode(chars: number): string {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";
    for (let i = 0; i < chars; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  }

  async function isCodeUnique(code: string): Promise<boolean> {
    const existingCoupon = await prisma.coupon.findUnique({
      where: { code },
    });
    return existingCoupon === null;
  }

  try {
    const couponsData: { chapterId: string; code: string }[] = [];
    for (let i = 0; i < numOfCoupons; i++) {
      let uniqueCode = generateUniqueCode(12);
      while (!(await isCodeUnique(uniqueCode))) {
        uniqueCode = generateUniqueCode(12);
      }
      couponsData.push({
        chapterId: params.chapterId,
        code: uniqueCode,
      });
    }

    const createdCoupons = await prisma.coupon.createMany({
      data: couponsData,
    });

    return NextResponse.json(createdCoupons);
  } catch (error: any) {
    if (error.code === 'P2002') {
      console.error("[COUPON_GENERATE] Unique constraint violation", error);
      return new NextResponse("Duplicate entry found", { status: 409 });
    } else {
      console.error("[COUPON_GENERATE] Internal Error", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }
}
