"use client";
import ModalCustom from "../ModalCustom";
import { useUploadImage } from "@/hooks/useUploadImage";
import { SubmitHandler } from "react-hook-form";
import { SettingRow } from "./SettingsColumns";
import SettingsForm from "./SettingsForm";
import { SettingSchema } from "@/schema/settingSchema";
import { useState } from "react";

type Props = {
  editSetting: SettingRow;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
  onClose: () => void;
};

export default function SettingsEditModal({
  editSetting,
  open,
  onOpenChange,
  authorId,
  loading,
  onSubmit,
  onClose,
}: Props) {
  const [currentType, setCurrentType] = useState<"value" | "image">(
    editSetting.publicId ? "image" : "value",
  );
  const { preview, addImage, uploadImage, resetImage, imageFile } =
    useUploadImage({
      folder: "settings",
      initialImage: editSetting.value,
      publicId: editSetting.publicId,
    });

  const handleSubmit: SubmitHandler<SettingSchema> = async (data) => {
    const { url, publicId } = await uploadImage();
    const isTextMode = !!data.value && !imageFile;
    onSubmit({
      ...data,
      key: data.key,
      value: isTextMode ? data.value : url || editSetting.value,
      publicId,
      authorId,
    });
  };

  return (
    <ModalCustom
      title="Update Settings"
      open={open}
      onOpenChange={onOpenChange}
      showTrigger={false}
      onClose={() => {
        resetImage();
        onClose();
      }}
    >
      <SettingsForm
        defaultValues={{
          key: editSetting.key,
          value: editSetting.value,
          publicId: editSetting.publicId,
        }}
        preview={preview}
        onAdd={addImage}
        onSubmit={handleSubmit}
        submitLabel="Update"
        loading={loading}
        onTypeChange={setCurrentType}
      />
    </ModalCustom>
  );
}
