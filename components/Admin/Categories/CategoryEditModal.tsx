"use client";
import ModalCustom from "../ModalCustom";
import CategoryForm from "./CategoryForm";
import { useUploadImage } from "@/hooks/useUploadImage";
import { CategoriesSchema } from "@/schema/categoriesSchema";
import { SubmitHandler } from "react-hook-form";
import { Category } from "@/types/type";

type Props = {
  category: Category;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  authorId?: string;
  loading: boolean;
  onSubmit: (
    data: CategoriesSchema & {
      image: string;
      publicId: string;
      id: string;
      authorId?: string;
    },
  ) => void;
  onClose: () => void;
};

export default function CategoryEditModal({
  category,
  open,
  onOpenChange,
  authorId,
  onSubmit,
  onClose,
  loading,
}: Props) {
  const { preview, addImage, uploadImage, resetImage } = useUploadImage({
    folder: "categories",
    initialImage: category.image,
    publicId: category.publicId,
  });

  const handleSubmit: SubmitHandler<CategoriesSchema> = async (data) => {
    const { url, publicId } = await uploadImage();
    onSubmit({
      ...data,
      image: url,
      publicId,
      id: category.id,
      authorId,
    });
  };

  return (
    <ModalCustom
      title="Update Category"
      open={open}
      onOpenChange={onOpenChange}
      showTrigger={false}
      onClose={() => {
        resetImage();
        onClose();
      }}
    >
      <CategoryForm
        defaultValues={{
          name: category.name,
          description: category.description,
        }}
        preview={preview}
        onAdd={addImage}
        onSubmit={handleSubmit}
        submitLabel="Update"
        loading={loading}
      />
    </ModalCustom>
  );
}
