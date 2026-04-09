"use client";
import { SlideSchema } from "@/schema/slideSchema";
import ModalCustom from "../ModalCustom";
import { SlideRow } from "./SlideColumns";
import SlideForm from "./SlideForm";
import { useUploadImage } from "@/hooks/useUploadImage";
import { SubmitHandler } from "react-hook-form";

type Props = {
  slide: SlideRow;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  authorId?: string;
  loading: boolean;
  onSubmit: (
    data: SlideSchema & {
      id: string;
      image: string;
      publicId: string;
      authorId?: string;
    },
  ) => void;
  onClose: () => void;
};

export default function SlideEditModal({
  slide,
  open,
  onOpenChange,
  authorId,
  loading,
  onSubmit,
  onClose,
}: Props) {
  const { preview, addImage, uploadImage, resetImage } = useUploadImage({
    folder: "slides",
    initialImage: slide.image,
    publicId: slide.publicId,
  });

  const handleSubmit: SubmitHandler<SlideSchema> = async (data) => {
    const { url, publicId } = await uploadImage();
    onSubmit({ ...data, id: slide.id, image: url, publicId, authorId });
  };

  return (
    <ModalCustom
      title="Update Slide"
      open={open}
      onOpenChange={onOpenChange}
      showTrigger={false}
      onClose={() => {
        resetImage();
        onClose();
      }}
    >
      <SlideForm
        defaultValues={{ title: slide.title, link: slide.link }}
        preview={preview}
        onAdd={addImage}
        onSubmit={handleSubmit}
        submitLabel="Update"
        loading={loading}
      />
    </ModalCustom>
  );
}
