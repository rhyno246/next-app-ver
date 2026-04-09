"use client";
import ModalCustom from "../ModalCustom";
import { useUploadImage } from "@/hooks/useUploadImage";
import { SubmitHandler } from "react-hook-form";
import { PostsSchema } from "@/schema/postsChema";
import PostsForm from "./PostsForm";
import { PostRow } from "@/types/type";

type Props = {
  post: PostRow;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  authorId?: string;
  loading: boolean;
  onSubmit: (
    data: PostsSchema & {
      id: string;
      title: string;
      content: string | undefined;
      image: string | undefined;
      publicId: string;
      authorId?: string;
    },
  ) => void;
  onClose: () => void;
};

export default function PostsEditModal({
  post,
  open,
  authorId,
  loading,
  onSubmit,
  onOpenChange,
  onClose,
}: Props) {
  const { preview, addImage, uploadImage, resetImage } = useUploadImage({
    folder: "blogs",
    initialImage: post.image,
    publicId: post.publicId,
  });

  const handleSubmit: SubmitHandler<PostsSchema> = async (data) => {
    const { url, publicId } = await uploadImage();
    onSubmit({
      ...data,
      id: post.id,
      title: data.title,
      image: url,
      content: data.content,
      publicId,
      authorId,
    });
  };

  return (
    <ModalCustom
      title="Update Product"
      open={open}
      onOpenChange={onOpenChange}
      showTrigger={false}
      onClose={() => {
        resetImage();
        onClose();
      }}
    >
      <PostsForm
        defaultValues={{
          title: post.title,
          content: post.content,
        }}
        preview={preview}
        onAddImage={addImage}
        onSubmit={handleSubmit}
        submitLabel="Update"
        loading={loading}
      />
    </ModalCustom>
  );
}
