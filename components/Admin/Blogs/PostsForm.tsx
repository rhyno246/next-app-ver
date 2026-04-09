"use client";
import CustomInput from "@/components/Common/CustomInput";
import UploadImage from "../UploadImage";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { postsSchema, PostsSchema } from "@/schema/postsChema";
import CustomEditor from "../QuillEditor";

type Props = {
  defaultValues?: Partial<PostsSchema>;
  preview: string;
  onAddImage: (files: File[]) => void;
  onSubmit: SubmitHandler<PostsSchema>;
  submitLabel?: string;
  loading?: boolean;
};

export default function PostsForm({
  defaultValues,
  preview,
  onAddImage,
  onSubmit,
  submitLabel = "Submit",
  loading,
}: Props) {
  const { control, handleSubmit } = useForm<PostsSchema>({
    resolver: zodResolver(postsSchema),
    defaultValues: {
      title: "",
      content: "",
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
        name="content"
        render={({ field }) => (
          <CustomEditor value={field.value} onChange={field.onChange} />
        )}
      />
      <UploadImage preview={preview} onAdd={onAddImage} />
      <Button type="submit" disabled={loading}>
        {loading ? "Loading..." : submitLabel}
      </Button>
    </form>
  );
}
