"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import dayjs from "dayjs";
import ToggleActive from "../ToggleActive";
import { UPDATE_CLIENT_AUTHOR } from "@/graphql/mutations";
import { GET_ADMIN_AUTHOR } from "@/graphql/queries";
import { roleType } from "@/Enum/enum";

export type UserRow = {
  id: string;
  email: string;
  phone: string;
  image: string;
  isActive: boolean;
  createdAt: string;
  role: { id: string; name: string };
};

type Actions = {
  onEdit: (user: UserRow) => void;
  onDelete: (id: string) => void;
};

export const usersColumns = ({
  onEdit,
  onDelete,
}: Actions): ColumnDef<UserRow>[] => [
  {
    id: "index",
    header: "#",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "image",
    header: "Avatar",
    cell: ({ row }) => (
      <Image
        src={row.original.image || "/images/users/user-04.jpg"}
        alt={row.original.email}
        width={40}
        height={40}
        className="rounded-full object-cover w-10 h-10"
      />
    ),
  },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => row.original.phone || "-",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <span className="px-2 py-1 rounded-full text-xs bg-blue/10 text-blue">
        {row.original.role?.name}
      </span>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Active",
    cell: ({ row }) => {
      const isProtected = [roleType.type_admin].includes(
        row.original.role?.name,
      );
      return (
        <>
          {!isProtected && (
            <ToggleActive
              id={row.original.id}
              isActive={row.original.isActive ?? false}
              mutation={UPDATE_CLIENT_AUTHOR}
              refetchQueries={[{ query: GET_ADMIN_AUTHOR }]}
            />
          )}
        </>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => dayjs(row.original.createdAt).format("DD/MM/YYYY"),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const isProtected = [roleType.type_admin].includes(
        row.original.role?.name,
      );
      return (
        <div className="flex gap-2">
          {!isProtected && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(row.original)}
            >
              <Pencil className="w-4 h-4 mr-1" /> Edit
            </Button>
          )}
          {!isProtected && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (confirm(`Delete "${row.original.email}"?`))
                  onDelete(row.original.id);
              }}
            >
              <Trash2 className="w-4 h-4 mr-1" /> Delete
            </Button>
          )}
        </div>
      );
    },
  },
];
