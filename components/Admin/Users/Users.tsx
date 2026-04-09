"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import WrapperPage from "../WrapperPage";
import { AdminAuthorResponse, Role, RoleResponse } from "@/types/type";
import { ADMIN_ROLE, GET_ADMIN_AUTHOR } from "@/graphql/queries";
import { usePagination } from "@/hooks/usePagination";
import { UserRow, usersColumns } from "./usersColumns";
import DataTable from "../DataTable/DataTable";
import UserCreateModal from "./UserCreateModal";
import {
  CREATE_AUTHOR,
  DELETE_AUTHOR,
  DELETE_AUTHORS,
  UPDATE_CLIENT_AUTHOR,
} from "@/graphql/mutations";
import { Toast } from "@/utils/toast";
import UserEditModal from "./UsersEditModal";
import { useState } from "react";
import { roleType } from "@/Enum/enum";

const breadcrumbs = [
  { label: "Home", href: "/admin/dashboard" },
  { label: "Users" },
];

export default function Users() {
  const [editUser, setEditUser] = useState<UserRow | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
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
      query: GET_ADMIN_AUTHOR,
      variables: { page, pageSize, search: debouncedSearch },
    },
  ];

  const { data: authorData, loading: loadingAuthor } =
    useQuery<AdminAuthorResponse>(GET_ADMIN_AUTHOR, {
      variables: { page, pageSize, search: debouncedSearch },
      fetchPolicy: "network-only",
    });
  const { data: roleData } = useQuery<RoleResponse>(ADMIN_ROLE);
  const [createAuthor, { loading: createLoading }] = useMutation(
    CREATE_AUTHOR,
    {
      refetchQueries,
      onCompleted: () => Toast.success("User  created successfully"),
      onError: (error) => Toast.error(error.message),
    },
  );
  const [updateAuthor, { loading: updateLoading }] = useMutation(
    UPDATE_CLIENT_AUTHOR,
    {
      refetchQueries,
      onCompleted: () => {
        Toast.success("User updated successfully");
      },
      onError: (error) => Toast.error(error.message),
    },
  );
  const [deleteAuthor] = useMutation(DELETE_AUTHOR, {
    refetchQueries,
    onCompleted: () => Toast.success("User deleted successfully"),
    onError: (error) => Toast.error(error.message),
  });

  const [deleteAuthors] = useMutation(DELETE_AUTHORS, {
    refetchQueries,
    onCompleted: () => Toast.success("Users deleted successfully"),
    onError: (error) => Toast.error(error.message),
  });

  const handleEdit = (user: UserRow) => {
    setEditUser(user);
    setIsEditOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure?")) deleteAuthor({ variables: { id } });
  };

  const handleDeleteSelected = (ids: string[]) => {
    deleteAuthors({ variables: { ids } });
  };

  const users = (authorData?.adminAuthor.data ?? []).filter(
    (u) => u.role?.name !== roleType.type_system,
  ) as unknown as UserRow[];
  const roles = roleData?.adminRole as unknown as Role[];
  const totalPages = authorData?.adminAuthor.totalPages ?? 1;
  const total = authorData?.adminAuthor.total ?? 0;
  const columns = usersColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });
  return (
    <WrapperPage title="Users" breadcrumbs={breadcrumbs}>
      <UserCreateModal
        loading={createLoading}
        onSubmit={(data) => createAuthor({ variables: { data } })}
        role={roles}
      />
      <UserEditModal
        user={editUser!}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        loading={updateLoading}
        onSubmit={(data) => updateAuthor({ variables: { data } })}
        onClose={() => setEditUser(null)}
        role={roles}
      />
      <DataTable
        columns={columns}
        data={users}
        loading={loadingAuthor}
        page={page}
        totalPages={totalPages}
        total={total}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        search={search}
        onSearch={handleSearch}
        onDeleteSelected={handleDeleteSelected}
        getRowId={(row: UserRow) => row.id}
        isRowSelectable={(row: UserRow) =>
          ![roleType.type_system, roleType.type_admin].includes(row.role?.name)
        }
      />
    </WrapperPage>
  );
}
