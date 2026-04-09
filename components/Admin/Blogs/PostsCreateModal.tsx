"use client";
import ModalCustom from "../ModalCustom";
import { useUploadImage } from "@/hooks/useUploadImage";
import { SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { PostsSchema } from "@/schema/postsChema";
import PostsForm from "./PostsForm";

type Props = {
  authorId?: string;
  loading: boolean;
  onSubmit: (
    data: PostsSchema & {
      title: string;
      image: string;
      publicId: string;
      authorId: string | undefined;
    },
  ) => void;
};

export default function PostsCreateModal({
  authorId,
  loading,
  onSubmit,
}: Props) {
  const [open, setOpen] = useState(false);
  const { preview, addImage, uploadImage, resetImage } = useUploadImage({
    folder: "blogs",
  });

  const handleSubmit: SubmitHandler<PostsSchema> = async (data) => {
    const { url, publicId } = await uploadImage();
    await onSubmit({
      ...data,
      image: url,
      publicId,
      authorId,
    });
    resetImage();
    setOpen(false);
  };

  return (
    <ModalCustom
      title="Create Posts"
      open={open}
      onOpenChange={setOpen}
      onClose={() => {
        resetImage();
      }}
    >
      <PostsForm
        preview={preview}
        onAddImage={addImage}
        onSubmit={handleSubmit}
        submitLabel="Create"
        loading={loading}
      />
    </ModalCustom>
  );
}
