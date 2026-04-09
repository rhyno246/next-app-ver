"use client";

import WrapperPage from "../WrapperPage";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_ADMIN_ORDERS } from "@/graphql/queries";
import { DELETE_ORDER, UPDATE_ORDER_STATUS } from "@/graphql/mutations";
import { usePagination } from "@/hooks/usePagination";
import DataTable from "../DataTable/DataTable";
import { Toast } from "@/utils/toast";
import { ColumnDef } from "@tanstack/react-table";
import { OrdersData } from "@/types/type";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const breadcrumbs = [
  { label: "Home", href: "/admin/dashboard" },
  { label: "Orders" },
];

const STATUS_OPTIONS = [
  "PENDING",
  "CONFIRMED",
  "SHIPPING",
  "SHIPPED",
  "CANCELLED",
  "REFUNDED",
];

type AdminOrdersResponse = {
  adminOrders: {
    data: OrdersData[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
};

export default function OrdersPage() {
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
      query: GET_ADMIN_ORDERS,
      variables: { page, pageSize, search: debouncedSearch },
    },
  ];

  const { data: ordersData, loading } = useQuery<AdminOrdersResponse>(
    GET_ADMIN_ORDERS,
    {
      variables: { page, pageSize, search: debouncedSearch },
      fetchPolicy: "network-only",
    },
  );

  const [updateOrderStatus] = useMutation(UPDATE_ORDER_STATUS, {
    refetchQueries,
    onCompleted: () => Toast.success("Order status updated"),
    onError: (error) => Toast.error(error.message),
  });

  const [deleteOrder] = useMutation(DELETE_ORDER, {
    refetchQueries,
    onCompleted: () => Toast.success("Order deleted"),
    onError: (error) => Toast.error(error.message),
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this order?")) {
      deleteOrder({ variables: { id } });
    }
  };

  const handleStatusChange = (id: string, status: string) => {
    updateOrderStatus({ variables: { id, status } });
  };

  const columns: ColumnDef<OrdersData>[] = [
    {
      id: "index",
      header: "#",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "shippingName",
      header: "Customer",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.shippingName}</p>
          <p className="text-xs text-gray-500">{row.original.shippingEmail}</p>
        </div>
      ),
    },
    {
      accessorKey: "shippingPhone",
      header: "Phone",
    },
    {
      accessorKey: "paymentMethod",
      header: "Shipping",
      cell: ({ row }) => (
        <span className="uppercase text-xs font-medium">
          {row.original.paymentMethod}
        </span>
      ),
    },
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ row }) => <span>${row.original.total}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <select
          value={row.original.status}
          onChange={(e) => handleStatusChange(row.original.id, e.target.value)}
          className={`text-xs font-medium px-2 py-1 rounded border outline-none cursor-pointer ${
            row.original.status === "PENDING"
              ? "bg-yellow-50 border-yellow-300 text-yellow-700"
              : row.original.status === "CONFIRMED"
                ? "bg-blue-50 border-blue-300 text-blue-700"
                : row.original.status === "SHIPPING"
                  ? "bg-purple-50 border-purple-300 text-purple-700"
                  : row.original.status === "SHIPPED"
                    ? "bg-green-50 border-green-300 text-green-700"
                    : row.original.status === "CANCELLED"
                      ? "bg-red-50 border-red-300 text-red-700"
                      : "bg-gray-50 border-gray-300 text-gray-700"
          }`}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
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

  const orders = ordersData?.adminOrders?.data ?? [];
  const totalPages = ordersData?.adminOrders?.totalPages ?? 1;
  const total = ordersData?.adminOrders?.total ?? 0;

  return (
    <WrapperPage title="Orders" breadcrumbs={breadcrumbs}>
      <DataTable
        columns={columns}
        data={orders}
        loading={loading}
        page={page}
        totalPages={totalPages}
        total={total}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        search={search}
        onSearch={handleSearch}
        getRowId={(row: OrdersData) => row.id}
      />
    </WrapperPage>
  );
}
