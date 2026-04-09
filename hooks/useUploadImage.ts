import { useState, useCallback } from "react";
import { Toast } from "@/utils/toast";

type Props = {
    folder: string;
    initialImage?: string;
    publicId?: string;
}

type UploadResult = {
    url: string;
    publicId: string;
};

export const useUploadImage = ({ folder, initialImage, publicId }: Props) => {
    const [preview, setPreview] = useState<string>("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const displayPreview = preview || initialImage || "";

    const addImage = useCallback((files: File[]) => {
        const file = files[0];
        if (!file) return;

        if (file.size > 3 * 1024 * 1024) {
            Toast.error("Image must be less than 3MB");
            return;
        }

        setImageFile(file);
        setPreview(URL.createObjectURL(file));
    }, []);

    const uploadImage = async (): Promise<UploadResult> => {
        if (!imageFile) return { url: initialImage ?? "", publicId: publicId ?? "" }

        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("folder", folder);
        formData.append("currentPublicId", publicId ?? "");
        

        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        return { url: data.url, publicId: data.public_id }; 
    };

    const resetImage = () => {
        setPreview("");
        setImageFile(null);
    };

    return { preview: displayPreview, imageFile, addImage, uploadImage, resetImage };
};