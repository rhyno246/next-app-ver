"use client";
import ModalCustom from "../ModalCustom";
import CategoryForm from "./CategoryForm";
import { useUploadImage } from "@/hooks/useUploadImage";
import { CategoriesSchema } from "@/schema/categoriesSchema";
import { SubmitHandler } from "react-hook-form";
import { useState } from "react";

type Props = {
  authorId?: string;
  loading: boolean;
  onSubmit: (
    data: CategoriesSchema & {
      image: string;
      publicId: string;
      authorId?: string;
    },
  ) => void;
};

export default function CategoryCreateModal({
  authorId,
  onSubmit,
  loading,
}: Props) {
  const { preview, addImage, uploadImage, resetImage } = useUploadImage({
    folder: "categories",
  });
  const [openForm, setOpenForm] = useState(false);
  const handleSubmit: SubmitHandler<CategoriesSchema> = async (data) => {
    const { url, publicId } = await uploadImage();
    onSubmit({
      ...data,
      image: url,
      publicId,
      authorId,
    });
    setOpenForm(false);
    resetImage();
  };

  return (
    <ModalCustom
      title="Create Category"
      onClose={resetImage}
      open={openForm}
      onOpenChange={setOpenForm}
    >
      <CategoryForm
        preview={preview}
        onAdd={addImage}
        onSubmit={handleSubmit}
        submitLabel="Create"
        loading={loading}
      />
    </ModalCustom>
  );
}
