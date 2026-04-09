"use client";
import CustomInput from "@/components/Common/CustomInput";
import UploadImage from "../UploadImage";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { slideSchema, SlideSchema } from "@/schema/slideSchema";

type Props = {
  defaultValues?: Partial<SlideSchema>;
  preview: string;
  onAdd: (files: File[]) => void;
  onSubmit: SubmitHandler<SlideSchema>;
  submitLabel?: string;
  loading?: boolean;
};

export default function SlideForm({
  defaultValues,
  preview,
  onAdd,
  onSubmit,
  submitLabel = "Submit",
  loading,
}: Props) {
  const { control, handleSubmit } = useForm<SlideSchema>({
    resolver: zodResolver(slideSchema),
    defaultValues: { title: "", link: "", ...defaultValues },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CustomInput
        control={control}
        name="title"
        label="Title"
        placeholder="Type Title"
      />
      <CustomInput
        control={control}
        name="link"
        label="Link"
        placeholder="Type Link"
      />
      <UploadImage preview={preview} onAdd={onAdd} />
      <Button type="submit" disabled={loading}>
        {loading ? "Loading..." : submitLabel}
      </Button>
    </form>
  );
}
