"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { CheckCheckIcon, Pencil, Trash2 } from "lucide-react";
import dayjs from "dayjs";
import Image from "next/image";

export type SettingRow = {
  id: string;
  key: string;
  publicId: string;
  value: string;
  createdAt: string;
  updatedAt: string;
};

type Actions = {
  onEdit: (slide: SettingRow) => void;
  onDelete: (id: string) => void;
};

export const settingsColumns = ({
  onEdit,
  onDelete,
}: Actions): ColumnDef<SettingRow>[] => [
  { id: "index", header: "#", cell: ({ row }) => row.index + 1 },
  { accessorKey: "key", header: "Key" },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => {
      const { value, publicId } = row.original;
      const isImage =
        !!publicId || /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(value);
      if (isImage) {
        return (
          <Image
            src={value || "/file.svg"}
            alt={value}
            width={40}
            height={40}
            unoptimized // tránh lỗi next/image với các host chưa config
            className="rounded-md object-cover"
          />
        );
      }
      return <span className="text-sm break-all">{value}</span>;
    },
  },
  {
    accessorKey: "publicId",
    header: "publicId",
    cell: ({ row }) => <>{row.original.publicId && <CheckCheckIcon />}</>,
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
            if (confirm(`Delete "${row.original.key}"?`))
              onDelete(row.original.id);
          }}
        >
          <Trash2 className="w-4 h-4 mr-1" /> Delete
        </Button>
      </div>
    ),
  },
];
