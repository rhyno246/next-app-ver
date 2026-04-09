"use client";
import CustomInput from "@/components/Common/CustomInput";
import { CustomSelect } from "@/components/Common/CustomSelect";
import UploadImage from "../UploadImage";
import UploadMultipleImages from "../UploadMultipleImages";
import { Button } from "@/components/ui/button";
import { productsSchema, ProductsSchema } from "@/schema/productsChema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Category, ImageItem } from "@/types/type";
import CustomEditor from "../QuillEditor";

type Props = {
  defaultValues?: Partial<ProductsSchema>;
  preview: string;
  images: ImageItem[];
  categories: Category[];
  onAddImage: (files: File[]) => void;
  onAddImages: (files: File[]) => void;
  onRemoveImage: (index: number) => void;
  onSubmit: SubmitHandler<ProductsSchema>;
  submitLabel?: string;
  loading?: boolean;
};

export default function ProductForm({
  defaultValues,
  preview,
  images,
  categories,
  onAddImage,
  onAddImages,
  onRemoveImage,
  onSubmit,
  submitLabel = "Submit",
  loading,
}: Props) {
  const { control, handleSubmit } = useForm<ProductsSchema>({
    resolver: zodResolver(productsSchema),
    defaultValues: {
      title: "",
      description: "",
      categories: [],
      sale: 0,
      price: 0,
      stock: 0,
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CustomInput
        control={control}
        name="title"
        label="Title"
        placeholder="Type Title"
      />
      <Controller
        control={control}
        name="description"
        render={({ field }) => (
          <CustomEditor value={field.value} onChange={field.onChange} />
        )}
      />
      <CustomInput
        type="number"
        control={control}
        name="sale"
        label="Sale %"
        placeholder="Type Sale"
      />
      <CustomInput
        type="number"
        control={control}
        name="price"
        label="Price"
        placeholder="Type Price"
      />
      <CustomInput
        type="number"
        control={control}
        name="stock"
        label="Stock"
        placeholder="Type Stock"
      />
      <CustomSelect
        control={control}
        name="categories"
        label="Category"
        isMulti
        options={categories.map((cat) => ({
          label: cat.name ?? "",
          value: cat.id,
        }))}
      />
      <UploadImage preview={preview} onAdd={onAddImage} />
      <UploadMultipleImages
        images={images}
        onAdd={onAddImages}
        onRemove={onRemoveImage}
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Loading..." : submitLabel}
      </Button>
    </form>
  );
}
