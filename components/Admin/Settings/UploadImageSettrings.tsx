"use client";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

type Props = {
  preview?: string;
  publicId?: string;
  onAdd: (files: File[]) => void;
};

export default function UploadImageSettrings({
  preview,
  onAdd,
  publicId,
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
    multiple: false, // ✅ single image
  });

  return (
    <div className="mb-5">
      <label className="block mb-2.5">Image</label>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-4 cursor-pointer flex flex-col items-center justify-center gap-2 transition ${
          isDragActive
            ? "border-blue bg-blue/5"
            : "border-gray-3 hover:border-blue"
        }`}
      >
        <input {...getInputProps()} />
        {preview &&
        (preview.startsWith("http") ||
          preview.startsWith("/") ||
          preview.startsWith("blob:")) ? (
          <Image
            src={preview}
            alt="preview"
            width={100}
            height={100}
            className="object-cover rounded-md"
          />
        ) : (
          <p className="text-dark-5 text-sm">
            {isDragActive
              ? "Drop image here..."
              : "Drag & drop or click to upload (max 3MB)"}
          </p>
        )}
      </div>
    </div>
  );
}
