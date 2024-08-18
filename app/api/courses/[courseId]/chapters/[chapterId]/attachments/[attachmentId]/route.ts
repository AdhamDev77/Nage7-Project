import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string; attachmentId: string } }
) {
  try {
    const session = await getCurrentUser();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: session?.user.id,
      },
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    // Delete the attachment
    const attachment = await db.attachment.delete({
      where: {
        id: params.attachmentId,
        chapterId: params.chapterId,
      },
    });

    return NextResponse.json(attachment, { status: 200 });
  } catch (error) {
    console.error("[COURSE_ID_ATTACHMENTS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
