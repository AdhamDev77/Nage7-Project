"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import toast from "react-hot-toast";

interface FileUploadProps {
    onChange: (url?: string) => void;
    endpoint: keyof typeof ourFileRouter;
}

export const FileUpload = ({
    onChange,
    endpoint
}: FileUploadProps) => {
    return (
        <UploadDropzone 
            endpoint={endpoint} 
            onClientUploadComplete={(res) => {
                const url = res?.[0]?.url;
                console.log("Upload complete:", res);
                if (url) {
                    onChange(url);
                } else {
                    console.error("No URL returned from upload");
                    toast.error("Failed to get upload URL");
                }
            }}
            onUploadError={(error: Error) => {
                console.error("Upload error:", error);
                toast.error(`${error?.message}`);
            }}
        />
    );
};
