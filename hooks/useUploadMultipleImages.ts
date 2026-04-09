import { useState, useCallback } from "react";
import { Toast } from "@/utils/toast";
import { ImageItem } from "@/types/type";


type UploadResult = {
    url: string;
    public_id: string;
};

type Props = {
    folder: string;
    initialImages?: { url: string; publicId?: string | null }[];
};

export const useUploadMultipleImages = ({ folder, initialImages = [] }: Props) => {
    const [originalImages] = useState(initialImages);
    const [images, setImages] = useState<ImageItem[]>(
        initialImages.map((img) => ({
            file: null,
            preview: img.url,
            publicId: img.publicId ?? undefined,
        }))
    );

    const addImages = useCallback((files: File[]) => {
        const validFiles = files.filter((file) => {
            if (file.size > 3 * 1024 * 1024) {
                Toast.error(`${file.name} must be less than 3MB`);
                return false;
            }
            return true;
        });

        const newImages = validFiles.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));

        setImages((prev) => [...prev, ...newImages]);
    }, []);

    const removeImage = useCallback((index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index)); // ✅ chỉ xóa state
    }, []);

    

    const uploadImages = async (): Promise<UploadResult[]> => {
        if (images.length === 0) return [];
        const removedImages = originalImages.filter(
            (init) => !images.some((img) => img.preview === init.url)
        );
        await Promise.all(
            removedImages
            .filter((img) => img.publicId)
            .map(async (img) => {
                await fetch("/api/upload", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ publicId: img.publicId }),
                });
            })
        );
        return await Promise.all(
            images.map(async (imageItem) => {
                // ✅ Không có file mới thì giữ ảnh cũ
                if (!imageItem.file) {
                    return { url: imageItem.preview, public_id: imageItem.publicId ?? "" };
                }

                const formData = new FormData();
                formData.append("file", imageItem.file);
                formData.append("folder", folder);
                if (imageItem.publicId) {
                    formData.append("currentPublicId", imageItem.publicId);
                }
                const res = await fetch("/api/upload", { method: "POST", body: formData });
                const data = await res.json();
                return { url: data.url, public_id: data.public_id } as UploadResult;
            })
        );
    };

    const resetImages = () => setImages([]);

    return { images, addImages, removeImage, uploadImages, resetImages };
};