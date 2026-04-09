import cloudinary from "@/utils/cloudinary";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const currentPublicId = formData.get("currentPublicId") as string;
        const folder = formData.get("folder") as string;

        if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

        if (currentPublicId) {
            try {
                await cloudinary.uploader.destroy(currentPublicId, { invalidate: true });
            } catch (e) {
                console.warn("Failed to delete old image:", e);
            }
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const result = await new Promise<UploadApiResponse>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder,
                    ...(folder === "avatars" && { width: 150, crop: "scale" }),
                    invalidate: true,
                    overwrite: true,
                },
                (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
                    if (error) {
                        console.error("Cloudinary error:", JSON.stringify(error));
                        reject(new Error(error.message ?? JSON.stringify(error)));
                    } else {
                        resolve(result as UploadApiResponse);
                    }
                }
            ).end(buffer);
        });

        return NextResponse.json({
            url: result.secure_url,
            public_id: result.public_id,
        });

    } catch (error) {
        const message = error instanceof Error ? error.message : JSON.stringify(error);
        console.error("Upload error:", message);
        return NextResponse.json(
            { error: "Upload failed", detail: message },
            { status: 500 }
        );
    }
}
export async function DELETE(req: NextRequest) {
    try {
        const { publicId } = await req.json();
        if (!publicId) return NextResponse.json({ error: "No publicId" }, { status: 400 });
        await cloudinary.uploader.destroy(publicId);
        return NextResponse.json({ message: "Deleted successfully" });
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
}