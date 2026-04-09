"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Category } from "@/types/type";

type Actions = {
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
};

export const categoriesColumns = ({
  onEdit,
  onDelete,
}: Actions): ColumnDef<Category>[] => [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => (
      <Image
        src={row.original.image || "/images/placeholder.jpg"}
        alt={row.original.name}
        width={50}
        height={50}
        className="rounded-md object-cover"
      />
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(row.original)}
        >
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(row.original.id)}
        >
          Delete
        </Button>
      </div>
    ),
  },
];
