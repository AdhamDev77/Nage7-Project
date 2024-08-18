import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    req: NextRequest, 
    { params }: { params: { chapterId: string, courseId: string } }
) {
    try {
        const session = await getCurrentUser();
        
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        
        const { url } = await req.json();

        const attachment = await db.attachment.create({
            data: {
                url,
                name: url.split("/").pop(),
                chapterId: params.chapterId
            }
        });
        
        return NextResponse.json(attachment, { status: 200 });
    } catch (error) {
        console.log("[CHAPTER_ID_ATTACHMENTS]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
