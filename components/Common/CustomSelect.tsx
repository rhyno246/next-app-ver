// CustomSelect.tsx
"use client";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import Select from "react-select";

type Option = {
  label: string;
  value: string;
};

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  options: Option[];
  isMulti?: boolean;
};

export function CustomSelect<T extends FieldValues>({
  control,
  name,
  label,
  options,
  isMulti = false,
}: Props<T>) {
  return (
    <div className="mb-5">
      {label && <label className="block mb-2.5">{label}</label>}
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <>
            <Select
              options={options}
              isMulti={isMulti}
              value={
                isMulti
                  ? options.filter((opt) =>
                      (field.value as string[])?.includes(opt.value),
                    )
                  : (options.find((opt) => opt.value === field.value) ?? null)
              }
              onChange={(selected) => {
                if (isMulti) {
                  field.onChange(
                    (selected as Option[]).map((opt) => opt.value),
                  );
                } else {
                  field.onChange((selected as Option | null)?.value ?? "");
                }
              }}
              placeholder="Select..."
              classNamePrefix="react-select"
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: fieldState.error ? "#ef4444" : "#e2e8f0",
                  borderRadius: "6px",
                  padding: "2px",
                }),
              }}
            />
            {fieldState.error && (
              <p className="text-red text-sm mt-1">
                {fieldState.error.message}
              </p>
            )}
          </>
        )}
      />
    </div>
  );
}
