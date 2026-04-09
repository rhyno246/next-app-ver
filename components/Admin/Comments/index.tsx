"use client";
import WrapperPage from "../WrapperPage";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  GET_COMMENT_ADMINS,
  GET_COMMENTS,
  GET_COMMENTS_HOME,
  GET_PRODUCT_DETAIL,
} from "@/graphql/queries";
import { usePagination } from "@/hooks/usePagination";
import DataTable from "../DataTable/DataTable";
import { Toast } from "@/utils/toast";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import dayjs from "dayjs";
import ToggleActive from "../ToggleActive";
import {
  DELETE_COMMENT,
  UPDATE_HOT_COMMENT,
  UPDATE_STATUS_COMMENT,
} from "@/graphql/mutations";
import ToggleIsHot from "../ToggleIsHot";

const breadcrumbs = [
  { label: "Home", href: "/admin/dashboard" },
  { label: "Comments" },
];

type CommentRow = {
  id: string;
  content: string;
  rating: number;
  email: string;
  name: string;
  isActive: boolean;
  isHot: boolean;
  productId: string;
  createdAt: string;
  product: {
    id: string;
    title: string;
  };
  author: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
};

type CommentsResponse = {
  getCommentAdmins: {
    data: CommentRow[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
};

export default function CommentsPage() {
  const {
    page,
    pageSize,
    search,
    debouncedSearch,
    handleSearch,
    handlePageChange,
  } = usePagination({ defaultPageSize: 10 });

  const refetchQueries = [
    {
      query: GET_COMMENT_ADMINS,
      variables: { page, pageSize, search: debouncedSearch },
    },
    {
      query: GET_COMMENTS,
    },
    {
      query: GET_PRODUCT_DETAIL,
    },
    {
      query: GET_COMMENTS_HOME,
    },
  ];

  const { data: commentsData, loading } = useQuery<CommentsResponse>(
    GET_COMMENT_ADMINS,
    {
      variables: { page, pageSize, search: debouncedSearch },
      fetchPolicy: "network-only",
    },
  );

  const [deleteComment] = useMutation(DELETE_COMMENT, {
    refetchQueries,
    onCompleted: () => Toast.success("Comment deleted successfully"),
    onError: (error) => Toast.error(error.message),
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this comment?")) {
      deleteComment({ variables: { id } });
    }
  };

  const columns: ColumnDef<CommentRow>[] = [
    {
      id: "index",
      header: "#",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "name",
      header: "Customer",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.name}</p>
          <p className="text-xs text-gray-500">{row.original.email}</p>
        </div>
      ),
    },
    {
      accessorKey: "product",
      header: "Product",
      cell: ({ row }) => (
        <p className="text-sm">{row.original.product?.title ?? "-"}</p>
      ),
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => (
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className={`fill-current ${star <= row.original.rating ? "text-[#FFA645]" : "text-gray-3"}`}
              width="14"
              height="14"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_375_9172)">
                <path
                  d="M16.7906 6.72187L11.7 5.93438L9.39377 1.09688C9.22502 0.759375 8.77502 0.759375 8.60627 1.09688L6.30002 5.9625L1.23752 6.72187C0.871891 6.77812 0.731266 7.25625 1.01252 7.50938L4.69689 11.3063L3.82502 16.6219C3.76877 16.9875 4.13439 17.2969 4.47189 17.0719L9.05627 14.5687L13.6125 17.0719C13.9219 17.2406 14.3156 16.9594 14.2313 16.6219L13.3594 11.3063L17.0438 7.50938C17.2688 7.25625 17.1563 6.77812 16.7906 6.72187Z"
                  fill=""
                />
              </g>
            </svg>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "content",
      header: "Content",
      cell: ({ row }) => (
        <p className="text-sm max-w-[200px] truncate">{row.original.content}</p>
      ),
    },
    {
      accessorKey: "isHot",
      header: "isHot",
      cell: ({ row }) => {
        return (
          <ToggleIsHot
            id={row.original.id}
            isHot={row.original.isHot}
            mutation={UPDATE_HOT_COMMENT}
            refetchQueries={refetchQueries}
          />
        );
      },
    },
    {
      accessorKey: "isActive",
      header: "Active",
      cell: ({ row }) => (
        <ToggleActive
          id={row.original.id}
          isActive={row.original.isActive}
          mutation={UPDATE_STATUS_COMMENT}
          refetchQueries={refetchQueries}
        />
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) =>
        dayjs(row.original.createdAt).format("DD/MM/YYYY HH:mm"),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleDelete(row.original.id)}
        >
          <Trash2 className="w-4 h-4 mr-1" /> Delete
        </Button>
      ),
    },
  ];

  const comments = commentsData?.getCommentAdmins?.data ?? [];
  const totalPages = commentsData?.getCommentAdmins?.totalPages ?? 1;
  const total = commentsData?.getCommentAdmins?.total ?? 0;

  return (
    <WrapperPage title="Comments" breadcrumbs={breadcrumbs}>
      <DataTable
        columns={columns}
        data={comments}
        loading={loading}
        page={page}
        totalPages={totalPages}
        total={total}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        search={search}
        onSearch={handleSearch}
        getRowId={(row: CommentRow) => row.id}
      />
    </WrapperPage>
  );
}
