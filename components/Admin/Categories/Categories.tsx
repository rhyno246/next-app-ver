"use client";
import WrapperPage from "../WrapperPage";
import { AdminCategoriesResponse, Category, MeResponse } from "@/types/type";
import {
  GET_ADMIN_CATEGORIES,
  GET_CATEGORIES,
  GET_ME,
} from "@/graphql/queries";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  CREATE_CATEGORY,
  DELETE_CATEGORIES,
  DELETE_CATEGORY,
  UPDATE_CATEGORY,
} from "@/graphql/mutations";
import { Toast } from "@/utils/toast";
import { categoriesColumns } from "./categoriesColumns";
import { usePagination } from "@/hooks/usePagination";
import DataTable from "../DataTable/DataTable";
import CategoryCreateModal from "./CategoryCreateModal";
import CategoryEditModal from "./CategoryEditModal";
import { useState } from "react";

const breadcrumbs = [
  { label: "Home", href: "/admin/dashboard" },
  { label: "Categories" },
];

export default function Categories() {
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const {
    page,
    pageSize,
    search,
    debouncedSearch,
    handleSearch,
    handlePageChange,
  } = usePagination({ defaultPageSize: 10 });

  const { data: meData } = useQuery<MeResponse>(GET_ME);
  const user = meData?.me;

  const refetchQueries = [
    {
      query: GET_ADMIN_CATEGORIES,
      variables: { page, pageSize, search: debouncedSearch },
    },
    {
      query: GET_CATEGORIES,
    },
  ];

  const { data: categoriesData, loading: loadingCategories } =
    useQuery<AdminCategoriesResponse>(GET_ADMIN_CATEGORIES, {
      variables: { page, pageSize, search: debouncedSearch },
      fetchPolicy: "network-only",
    });

  const [createCategory, { loading: createLoading }] = useMutation(
    CREATE_CATEGORY,
    {
      refetchQueries,
      onCompleted: () => Toast.success("Category created successfully"),
      onError: (error) => Toast.error(error.message),
    },
  );

  const [updateCategory, { loading: updateLoading }] = useMutation(
    UPDATE_CATEGORY,
    {
      refetchQueries,
      onCompleted: () => {
        Toast.success("Category updated successfully");
        setEditCategory(null);
        setIsEditOpen(false);
      },
      onError: (error) => Toast.error(error.message),
    },
  );

  const [deleteCategory] = useMutation(DELETE_CATEGORY, {
    refetchQueries,
    onCompleted: () => Toast.success("Category deleted successfully"),
    onError: (error) => Toast.error(error.message),
  });

  const [deleteCategories] = useMutation(DELETE_CATEGORIES, {
    refetchQueries,
    onCompleted: () => Toast.success("Categories deleted successfully"),
    onError: (error) => Toast.error(error.message),
  });

  const handleEdit = (category: Category) => {
    setEditCategory(category);
    setIsEditOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure?")) deleteCategory({ variables: { id } });
  };

  const handleDeleteSelected = (ids: string[]) => {
    deleteCategories({ variables: { ids } });
  };

  const categories = categoriesData?.adminCategories.data ?? [];
  const totalPages = categoriesData?.adminCategories.totalPages ?? 1;
  const total = categoriesData?.adminCategories.total ?? 0;
  const columns = categoriesColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  return (
    <WrapperPage title="Categories" breadcrumbs={breadcrumbs}>
      <div className="flex gap-2 mb-4">
        <CategoryCreateModal
          authorId={user?.id ? String(user.id) : undefined}
          onSubmit={(data) => createCategory({ variables: { data } })}
          loading={createLoading}
        />
        {editCategory && (
          <CategoryEditModal
            category={editCategory}
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
            authorId={user?.id ? String(user.id) : undefined}
            onSubmit={(data) => updateCategory({ variables: { data } })}
            onClose={() => setEditCategory(null)}
            loading={updateLoading}
          />
        )}
      </div>

      <DataTable
        columns={columns}
        data={categories}
        loading={loadingCategories}
        page={page}
        totalPages={totalPages}
        total={total}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        search={search}
        onSearch={handleSearch}
        onDeleteSelected={handleDeleteSelected}
        getRowId={(row: Category) => row.id}
      />
    </WrapperPage>
  );
}
