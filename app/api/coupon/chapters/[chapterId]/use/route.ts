import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

interface CouponRequest extends NextRequest {
  json: () => Promise<{ code: string }>;
}

export async function POST(
  req: CouponRequest,
  { params }: { params: { chapterId: string } }
) {
  try {
    const { userId } = auth();
    const { code } = await req.json();

    if( !userId){
        return new NextResponse("Unauthorized", { status: 402 });
    }

    const coupon = await prisma.coupon.findFirst({
      where: {
        chapterId: params.chapterId,
        code: code,
      },
    });

    if( !coupon ){
        return new NextResponse("Coupon not found", { status: 402 });
    }

    const updatedCoupon = await prisma.coupon.update({
      where: {
        chapterId: params.chapterId,
        code: code,
      },
      data: {
        isUsed: true,
        userId: userId,
      },
    });

    return NextResponse.json(updatedCoupon);
  } catch (error) {
    console.error("[COUPON_USE] Internal Error", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
