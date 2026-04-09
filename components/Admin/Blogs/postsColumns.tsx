"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import dayjs from "dayjs";
import { PostRow } from "@/types/type";

type Actions = {
  onEdit: (post: PostRow) => void;
  onDelete: (id: string) => void;
};

export const postsColumns = ({
  onEdit,
  onDelete,
}: Actions): ColumnDef<PostRow>[] => [
  {
    id: "index",
    header: "#",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => (
      <Image
        src={row.original.image || "/images/blog/blog-02.jpg"}
        alt={row.original.title}
        width={50}
        height={50}
        className="rounded-md object-cover w-12-5 h-12-5"
      />
    ),
  },
  { accessorKey: "title", header: "Title" },
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
