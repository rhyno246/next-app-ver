"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import dayjs from "dayjs";
import ToggleActive from "../ToggleActive";
import { UPDATE_SLIDE } from "@/graphql/mutations";
import { GET_SLIDES } from "@/graphql/queries";

export type SlideRow = {
  id: string;
  title: string;
  image: string;
  publicId: string;
  link: string;
  isActive: boolean;
  createdAt: string;
};

type Actions = {
  onEdit: (slide: SlideRow) => void;
  onDelete: (id: string) => void;
};

export const slideColumns = ({
  onEdit,
  onDelete,
}: Actions): ColumnDef<SlideRow>[] => [
  { id: "index", header: "#", cell: ({ row }) => row.index + 1 },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => (
      <Image
        src={row.original.image || "/images/placeholder.jpg"}
        alt={row.original.title}
        width={80}
        height={40}
        className="rounded-md object-cover"
      />
    ),
  },
  { accessorKey: "title", header: "Title" },
  {
    accessorKey: "isActive",
    header: "Active",
    cell: ({ row }) => (
      <ToggleActive
        id={row.original.id}
        isActive={row.original.isActive}
        mutation={UPDATE_SLIDE}
        refetchQueries={[{ query: GET_SLIDES }]}
      />
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => dayjs(row.original.createdAt).format("DD/MM/YYYY"),
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
          <Pencil className="w-4 h-4 mr-1" /> Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => {
            if (confirm(`Delete "${row.original.title}"?`))
              onDelete(row.original.id);
          }}
        >
          <Trash2 className="w-4 h-4 mr-1" /> Delete
        </Button>
      </div>
    ),
  },
];
