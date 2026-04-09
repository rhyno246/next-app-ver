"use client";
import CustomInput from "@/components/Common/CustomInput";
import { CustomSelect } from "@/components/Common/CustomSelect";
import { Button } from "@/components/ui/button";
import { roleType } from "@/Enum/enum";
import { Role } from "@/types/type";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

export const userSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  roleId: z.string().min(1, "Role is required"),
});

export type UserSchema = z.infer<typeof userSchema>;

type Props = {
  defaultValues?: Partial<UserSchema>;
  onSubmit: SubmitHandler<UserSchema>;
  submitLabel?: string;
  loading?: boolean;
  role: Role[];
};

export default function UserForm({
  defaultValues,
  onSubmit,
  submitLabel = "Submit",
  loading,
  role,
}: Props) {
  const { control, handleSubmit } = useForm<UserSchema>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      password: "",
      roleId: "",
      ...defaultValues,
    },
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CustomInput
        control={control}
        name="email"
        label="Email"
        placeholder="Type Email"
      />
      <CustomInput
        type="password"
        control={control}
        name="password"
        label="Password"
        placeholder="Type Password"
      />

      <CustomSelect
        control={control}
        name="roleId"
        label="Role"
        options={role
          .filter((item) => item.name !== roleType.type_system)
          .map((item) => ({
            label: item.name ?? "",
            value: item.id,
          }))}
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Loading..." : submitLabel}
      </Button>
    </form>
  );
}
