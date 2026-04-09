"use client";
import WrapperPage from "../WrapperPage";
import {
  CategoriesResponse,
  MeResponse,
  ProductRow,
  ProductsResponse,
} from "@/types/type";
import { GET_CATEGORIES, GET_ME, GET_PRODUCTS } from "@/graphql/queries";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  CREATE_PRODUCTS,
  DELETE_PRODUCT,
  DELETE_PRODUCTS,
  UPDATE_PRODUCT,
} from "@/graphql/mutations";
import { Toast } from "@/utils/toast";
import { usePagination } from "@/hooks/usePagination";
import DataTable from "../DataTable/DataTable";
import ProductCreateModal from "./ProductCreateModal";
import { useState } from "react";
import { productsColumns } from "./productsColumns";
import ProductEditModal from "./ProductEditModal";

const breadcrumbs = [
  { label: "Home", href: "/admin/dashboard" },
  { label: "Products" },
];

export default function Products() {
  const [editProduct, setEditProduct] = useState<ProductRow | null>(null);
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
  const { data: categoriesData } = useQuery<CategoriesResponse>(GET_CATEGORIES);
  const user = meData?.me;
  const categories = categoriesData?.categories ?? [];

  const refetchQueries = [
    {
      query: GET_PRODUCTS,
      variables: { page, pageSize, search: debouncedSearch },
    },
  ];

  const { data: productsData, loading: loadingProducts } =
    useQuery<ProductsResponse>(GET_PRODUCTS, {
      variables: { page, pageSize, search: debouncedSearch },
      fetchPolicy: "network-only",
    });

  const [createProduct, { loading: creating }] = useMutation(CREATE_PRODUCTS, {
    refetchQueries,
    onCompleted: () => Toast.success("Product created successfully"),
    onError: (error) => Toast.error(error.message),
  });

  const [updateProduct, { loading: updating }] = useMutation(UPDATE_PRODUCT, {
    refetchQueries,
    onCompleted: () => {
      Toast.success("Product updated successfully");
      setEditProduct(null);
      setIsEditOpen(false);
    },
    onError: (error) => Toast.error(error.message),
  });

  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    refetchQueries,
    onCompleted: () => Toast.success("Product deleted successfully"),
    onError: (error) => Toast.error(error.message),
  });

  const [deleteProducts] = useMutation(DELETE_PRODUCTS, {
    refetchQueries,
    onCompleted: () => Toast.success("Products deleted successfully"),
    onError: (error) => Toast.error(error.message),
  });

  const handleEdit = (product: ProductRow) => {
    setEditProduct(product);
    setIsEditOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure?")) deleteProduct({ variables: { id } });
  };

  const handleDeleteSelected = (ids: string[]) => {
    deleteProducts({ variables: { ids } });
  };

  const products = productsData?.products?.data ?? [];
  const totalPages = productsData?.products?.totalPages ?? 1;
  const total = productsData?.products?.total ?? 0;
  const columns = productsColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  return (
    <WrapperPage title="Products" breadcrumbs={breadcrumbs}>
      <div className="flex gap-2 mb-4">
        <ProductCreateModal
          authorId={user?.id ? String(user.id) : undefined}
          loading={creating}
          categories={categories}
          onSubmit={(data) =>
            createProduct({
              variables: {
                data: {
                  ...data,
                  categories: data.categories,
                },
              },
            })
          }
        />
        {editProduct && (
          <ProductEditModal
            product={editProduct}
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
            authorId={user?.id ? String(user.id) : undefined}
            loading={updating}
            categories={categories}
            onSubmit={(data) =>
              updateProduct({
                variables: {
                  data: {
                    ...data,
                    categories: data.categories,
                  },
                },
              })
            }
            onClose={() => setEditProduct(null)}
          />
        )}
      </div>

      <DataTable
        columns={columns}
        data={products}
        loading={loadingProducts}
        page={page}
        totalPages={totalPages}
        total={total}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        search={search}
        onSearch={handleSearch}
        onDeleteSelected={handleDeleteSelected}
        getRowId={(row: ProductRow) => row.id}
      />
    </WrapperPage>
  );
}
