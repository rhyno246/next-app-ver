"use client";
import CustomInput from "@/components/Common/CustomInput";
import UploadImage from "../UploadImage";
import { Button } from "@/components/ui/button";
import { categoriesSchema, CategoriesSchema } from "@/schema/categoriesSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

type Props = {
  defaultValues?: Partial<CategoriesSchema>;
  preview: string;
  onAdd: (files: File[]) => void;
  onSubmit: SubmitHandler<CategoriesSchema>;
  submitLabel?: string;
  loading?: boolean;
};

export default function CategoryForm({
  defaultValues,
  preview,
  onAdd,
  onSubmit,
  submitLabel = "Submit",
  loading,
}: Props) {
  const { control, handleSubmit } = useForm<CategoriesSchema>({
    resolver: zodResolver(categoriesSchema),
    defaultValues: { name: "", description: "", ...defaultValues },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CustomInput
        control={control}
        name="name"
        label="Name"
        placeholder="Type Name"
      />
      <CustomInput
        control={control}
        name="description"
        label="Description"
        placeholder="Type Description"
      />
      <UploadImage preview={preview} onAdd={onAdd} />
      <Button type="submit" disabled={loading}>
        {loading ? "Loading..." : submitLabel}
      </Button>
    </form>
  );
}
