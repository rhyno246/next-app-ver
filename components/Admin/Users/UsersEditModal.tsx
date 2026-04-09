"use client";
import ModalCustom from "../ModalCustom";
import { SubmitHandler } from "react-hook-form";
import { UserRow } from "./usersColumns";
import UserForm, { UserSchema } from "./UsersForm";
import { Role } from "@/types/type";

type Props = {
  user: UserRow;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loading: boolean;
  onSubmit: (data: UserSchema & { id: string }) => void;
  onClose: () => void;
  role: Role[];
};

export default function UserEditModal({
  role,
  user,
  open,
  onOpenChange,
  loading,
  onSubmit,
  onClose,
}: Props) {
  const handleSubmit: SubmitHandler<UserSchema> = async (data) => {
    onSubmit({ ...data, id: user.id });
    onOpenChange(false);
  };

  return (
    <ModalCustom
      title="Update User"
      open={open}
      onOpenChange={onOpenChange}
      showTrigger={false}
      onClose={onClose}
    >
      <UserForm
        defaultValues={{
          email: user?.email,
          password: "",
          roleId: user?.role?.id ?? "",
        }}
        onSubmit={handleSubmit}
        submitLabel="Update"
        loading={loading}
        role={role}
      />
    </ModalCustom>
  );
}
