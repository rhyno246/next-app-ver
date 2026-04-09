"use client";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { ImageItem } from "@/types/type";

type Props = {
  images: ImageItem[];
  onAdd: (files: File[]) => void;
  onRemove: (index: number) => void;
};

export default function UploadMultipleImages({
  images,
  onAdd,
  onRemove,
}: Props) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onAdd(acceptedFiles);
    },
    [onAdd],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
  });

  return (
    <div className="mb-5">
      <label className="block mb-2.5">Images</label>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-4 cursor-pointer text-center transition ${
          isDragActive
            ? "border-blue bg-blue/5"
            : "border-gray-3 hover:border-blue"
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-dark-5 text-sm">
          {isDragActive
            ? "Drop images here..."
            : "Drag & drop or click to upload (max 3MB each)"}
        </p>
      </div>

      {/* Preview */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-3">
          {images.map((img, index) => (
            <div key={index} className="relative w-20 h-20">
              <Image
                src={img.preview}
                alt={`preview-${index}`}
                fill
                className="object-cover rounded-md"
              />
              {/* ✅ Nút xóa */}
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
