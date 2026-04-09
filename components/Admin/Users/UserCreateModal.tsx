"use client";
import ModalCustom from "../ModalCustom";
import { SubmitHandler } from "react-hook-form";
import { useState } from "react";
import UserForm, { UserSchema } from "./UsersForm";
import { Role } from "@/types/type";

type Props = {
  loading: boolean;
  onSubmit: (data: UserSchema & { authorId?: string }) => void;
  role: Role[];
};

export default function UserCreateModal({ onSubmit, loading, role }: Props) {
  const [openForm, setOpenForm] = useState(false);

  const handleSubmit: SubmitHandler<UserSchema> = async (data) => {
    onSubmit({ ...data });
    setOpenForm(false);
  };

  return (
    <ModalCustom title="Create User" open={openForm} onOpenChange={setOpenForm}>
      <UserForm
        onSubmit={handleSubmit}
        submitLabel="Create"
        loading={loading}
        role={role}
      />
    </ModalCustom>
  );
}
