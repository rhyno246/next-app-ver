"use client";
import ModalCustom from "../ModalCustom";
import SlideForm from "./SlideForm";
import { useUploadImage } from "@/hooks/useUploadImage";
import { SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { SlideSchema } from "@/schema/slideSchema";

type Props = {
  authorId?: string;
  loading: boolean;
  onSubmit: (
    data: SlideSchema & { image: string; publicId: string; authorId?: string },
  ) => void;
};

export default function SlideCreateModal({
  authorId,
  loading,
  onSubmit,
}: Props) {
  const [open, setOpen] = useState(false);
  const { preview, addImage, uploadImage, resetImage } = useUploadImage({
    folder: "slides",
  });

  const handleSubmit: SubmitHandler<SlideSchema> = async (data) => {
    const { url, publicId } = await uploadImage();
    await onSubmit({ ...data, image: url, publicId, authorId });
    resetImage();
    setOpen(false);
  };

  return (
    <ModalCustom
      title="Create Slide"
      open={open}
      onOpenChange={setOpen}
      onClose={resetImage}
    >
      <SlideForm
        preview={preview}
        onAdd={addImage}
        onSubmit={handleSubmit}
        submitLabel="Create"
        loading={loading}
      />
    </ModalCustom>
  );
}
