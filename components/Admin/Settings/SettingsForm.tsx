"use client";
import CustomInput from "@/components/Common/CustomInput";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { settingSchema, SettingSchema } from "@/schema/settingSchema";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import UploadImageSettrings from "./UploadImageSettrings";

type Props = {
  defaultValues?: Partial<SettingSchema>;
  preview: string;
  onAdd: (files: File[]) => void;
  onSubmit: SubmitHandler<SettingSchema>;
  submitLabel?: string;
  loading?: boolean;
  onTypeChange?: (type: "value" | "image") => void;
};

export default function SettingsForm({
  defaultValues,
  preview,
  onTypeChange,
  onAdd,
  onSubmit,
  submitLabel = "Submit",
  loading,
}: Props) {
  const publicId = defaultValues?.publicId || "";
  const value = defaultValues?.value || "";

  const isImageValue = (val: string) =>
    val.startsWith("https://res.cloudinary.com") ||
    val.startsWith("https://storage.googleapis.com") ||
    /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(val);
  const [valueType, setValueType] = useState(
    publicId !== "" || isImageValue(value) ? "image" : "value",
  );

  const {
    control,
    handleSubmit,
    setValue: setFormValue,
  } = useForm<SettingSchema>({
    resolver: zodResolver(settingSchema),
    defaultValues: { key: "", value: "", publicId: "", ...defaultValues },
  });

  const handleChangeForm = (val: string) => {
    const type = val as "value" | "image";
    setValueType(val);
    onTypeChange?.(type);
    if (val === "image") {
      setFormValue("value", "");
    } else {
      setFormValue("value", "");
      setFormValue("publicId", "");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CustomInput
        control={control}
        name="key"
        label="Key"
        placeholder="Type Key"
      />

      <RadioGroup
        value={valueType}
        className="w-fit flex gap-10 mb-5"
        onValueChange={handleChangeForm}
      >
        <div className="flex items-center gap-3">
          <RadioGroupItem value="value" id="r1" />
          <Label htmlFor="r1">Value</Label>
        </div>
        <div className="flex items-center gap-3">
          <RadioGroupItem value="image" id="r2" />
          <Label htmlFor="r2">Image</Label>
        </div>
      </RadioGroup>

      {valueType === "image" ? (
        <UploadImageSettrings
          preview={preview}
          onAdd={onAdd}
          publicId={publicId}
        />
      ) : (
        <CustomInput
          control={control}
          name="value"
          label="Value"
          placeholder="Type Value"
        />
      )}

      <Button type="submit" disabled={loading}>
        {loading ? "Loading..." : submitLabel}
      </Button>
    </form>
  );
}
