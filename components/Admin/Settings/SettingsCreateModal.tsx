"use client";
import ModalCustom from "../ModalCustom";
import { useUploadImage } from "@/hooks/useUploadImage";
import { SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { SettingSchema } from "@/schema/settingSchema";
import SettingsForm from "./SettingsForm";

type Props = {
  authorId?: string;
  loading: boolean;
  onSubmit: (
    data: SettingSchema & {
      key: string;
      value: string | undefined;
      publicId: string;
      authorId?: string;
    },
  ) => void;
};

export default function SettingsCreateModal({
  authorId,
  loading,
  onSubmit,
}: Props) {
  const [open, setOpen] = useState(false);
  const { preview, addImage, uploadImage, resetImage } = useUploadImage({
    folder: "settings",
  });

  const handleSubmit: SubmitHandler<SettingSchema> = async (data) => {
    const { url, publicId } = await uploadImage();
    await onSubmit({
      ...data,
      value: url ? url : data.value,
      publicId,
      authorId,
    });
    resetImage();
    setOpen(false);
  };

  return (
    <ModalCustom
      title="Create Slide"
      open={open}
      onOpenChange={setOpen}
      onClose={resetImage}
    >
      <SettingsForm
        preview={preview}
        onAdd={addImage}
        onSubmit={handleSubmit}
        submitLabel="Create"
        loading={loading}
      />
    </ModalCustom>
  );
}
