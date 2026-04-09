"use client";
import ModalCustom from "../ModalCustom";
import { useUploadImage } from "@/hooks/useUploadImage";
import { useUploadMultipleImages } from "@/hooks/useUploadMultipleImages";
import { ProductsSchema } from "@/schema/productsChema";
import { SubmitHandler } from "react-hook-form";
import { Category, ProductRow } from "@/types/type";
import ProductForm from "./ProductsForm";

type Props = {
  product: ProductRow;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  authorId?: string;
  loading: boolean;
  categories: Category[];
  onSubmit: (
    data: ProductsSchema & {
      id: string;
      image: string;
      publicId: string;
      authorId?: string;
      imageUrls: string[];
      imagePublicIds: string[];
      categories: string[];
    },
  ) => void;
  onClose: () => void;
};

export default function ProductEditModal({
  product,
  open,
  onOpenChange,
  authorId,
  loading,
  categories,
  onSubmit,
  onClose,
}: Props) {
  const { preview, addImage, uploadImage, resetImage } = useUploadImage({
    folder: "products",
    initialImage: product.image,
    publicId: product.publicId,
  });

  const { images, addImages, removeImage, uploadImages, resetImages } =
    useUploadMultipleImages({
      folder: "products",
      initialImages: product.images,
    });

  const handleSubmit: SubmitHandler<ProductsSchema> = async (data) => {
    const { url, publicId } = await uploadImage();
    const uploadedImages = await uploadImages();
    onSubmit({
      ...data,
      id: product.id,
      image: url,
      publicId,
      authorId,
      imageUrls: uploadedImages.map((img) => img.url),
      imagePublicIds: uploadedImages.map((img) => img.public_id),
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
        resetImages();
        onClose();
      }}
    >
      <ProductForm
        defaultValues={{
          title: product.title,
          price: product.price,
          stock: product.stock,
          sale: product.sale,
          description: product.description,
          categories: product.categories?.map((c) => c.category.id) ?? [],
        }}
        preview={preview}
        images={images}
        categories={categories}
        onAddImage={addImage}
        onAddImages={addImages}
        onRemoveImage={removeImage}
        onSubmit={handleSubmit}
        submitLabel="Update"
        loading={loading}
      />
    </ModalCustom>
  );
}
