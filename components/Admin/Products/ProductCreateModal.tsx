"use client";
import ModalCustom from "../ModalCustom";
import { useUploadImage } from "@/hooks/useUploadImage";
import { useUploadMultipleImages } from "@/hooks/useUploadMultipleImages";
import { ProductsSchema } from "@/schema/productsChema";
import { SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { Category } from "@/types/type";
import ProductForm from "./ProductsForm";

type Props = {
  authorId?: string;
  loading: boolean;
  categories: Category[];
  onSubmit: (
    data: ProductsSchema & {
      image: string;
      publicId: string;
      authorId?: string;
      imageUrls: string[];
      imagePublicIds: string[];
      categories: string[];
    },
  ) => void;
};

export default function ProductCreateModal({
  authorId,
  loading,
  categories,
  onSubmit,
}: Props) {
  const [open, setOpen] = useState(false);
  const { preview, addImage, uploadImage, resetImage } = useUploadImage({
    folder: "products",
  });
  const { images, addImages, removeImage, uploadImages, resetImages } =
    useUploadMultipleImages({ folder: "products" });

  const handleSubmit: SubmitHandler<ProductsSchema> = async (data) => {
    const { url, publicId } = await uploadImage();
    const uploadedImages = await uploadImages();
    await onSubmit({
      ...data,
      image: url,
      publicId,
      authorId,
      imageUrls: uploadedImages.map((img) => img.url),
      imagePublicIds: uploadedImages.map((img) => img.public_id),
    });
    resetImage();
    resetImages();
    setOpen(false);
  };

  return (
    <ModalCustom
      title="Create Products"
      open={open}
      onOpenChange={setOpen}
      onClose={() => {
        resetImage();
        resetImages();
      }}
    >
      <ProductForm
        preview={preview}
        images={images}
        categories={categories}
        onAddImage={addImage}
        onAddImages={addImages}
        onRemoveImage={removeImage}
        onSubmit={handleSubmit}
        submitLabel="Create"
        loading={loading}
      />
    </ModalCustom>
  );
}
