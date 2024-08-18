import { getCurrentUser } from "@/lib/session";
import { createUploadthing, type FileRouter } from "uploadthing/next";

// Custom middleware return type (you might need to adjust this based on actual requirements)
type MiddlewareAuthObject = {
    userId: string;
};

const f = createUploadthing();

const handleAuth = async (): Promise<MiddlewareAuthObject> => {
    try {
        const session = await getCurrentUser();
        if (!session?.user) {
            console.error("Unauthorized access attempt");
            throw new Error("unauthorized");
        }
        console.log(`Authorized user: ${session?.user.id}`);
        return { userId:session?.user.id };
    } catch (error) {
        console.error("Error in handleAuth:", error);
        throw new Error("Authentication error");
    }
}

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    courseImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(async () => await handleAuth())
        .onUploadComplete((res) => {
            console.log("Upload complete for courseImage", res);
        }),
    courseAttachment: f(["text", "image", "video", "audio", "pdf"])
        .middleware(async () => await handleAuth())
        .onUploadComplete((res) => {
            console.log("Upload complete for courseAttachment", res);
        }),
    courseVideo: f({ video: { maxFileCount: 1, maxFileSize: "512GB" } })
        .middleware(async () => await handleAuth())
        .onUploadComplete((res) => {
            console.log("Upload complete for courseVideo", res);
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
