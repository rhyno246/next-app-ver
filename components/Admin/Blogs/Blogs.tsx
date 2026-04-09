"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import WrapperPage from "../WrapperPage";
import { MeResponse, PostRow, PostsResponse } from "@/types/type";
import { GET_ME, GET_POSTS } from "@/graphql/queries";
import { usePagination } from "@/hooks/usePagination";
import { useState } from "react";
import { postsColumns } from "./postsColumns";
import {
  CREATE_POST,
  DELETE_POST,
  DELETE_POSTS,
  UPDATE_POST,
} from "@/graphql/mutations";
import { Toast } from "@/utils/toast";
import DataTable from "../DataTable/DataTable";
import PostsCreateModal from "./PostsCreateModal";
import PostsEditModal from "./PostsEditModal";

const breadcrumbs = [
  { label: "Home", href: "/admin/dashboard" },
  { label: "Blogs" },
];
export default function Blogs() {
  const [editPost, setEditPost] = useState<PostRow | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { data: meData } = useQuery<MeResponse>(GET_ME);
  const user = meData?.me;
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
      query: GET_POSTS,
      variables: { page, pageSize, search: debouncedSearch },
    },
  ];

  const { data: postsData, loading: loadingPosts } = useQuery<PostsResponse>(
    GET_POSTS,
    {
      variables: { page, pageSize, search: debouncedSearch },
      fetchPolicy: "network-only",
    },
  );
  const [updatePost, { loading: updating }] = useMutation(UPDATE_POST, {
    refetchQueries,
    onCompleted: () => {
      Toast.success("Product updated successfully");
      setEditPost(null);
      setIsEditOpen(false);
    },
    onError: (error) => Toast.error(error.message),
  });

  const [createPost, { loading: creating }] = useMutation(CREATE_POST, {
    refetchQueries,
    onCompleted: () => Toast.success("Product created successfully"),
    onError: (error) => Toast.error(error.message),
  });

  const [deletePost] = useMutation(DELETE_POST, {
    refetchQueries,
    onCompleted: () => Toast.success("Product deleted successfully"),
    onError: (error) => Toast.error(error.message),
  });

  const [deletePosts] = useMutation(DELETE_POSTS, {
    refetchQueries,
    onCompleted: () => Toast.success("Products deleted successfully"),
    onError: (error) => Toast.error(error.message),
  });

  const handleEdit = (post: PostRow) => {
    setEditPost(post);
    setIsEditOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure?")) deletePost({ variables: { id } });
  };

  const handleDeleteSelected = (ids: string[]) => {
    deletePosts({ variables: { ids } });
  };

  const posts = postsData?.posts?.data ?? [];
  const totalPages = postsData?.posts?.totalPages ?? 1;
  const total = postsData?.posts?.total ?? 0;
  const columns = postsColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  return (
    <WrapperPage title="Blogs" breadcrumbs={breadcrumbs}>
      <PostsCreateModal
        authorId={user?.id ? String(user.id) : undefined}
        loading={creating}
        onSubmit={(data) => createPost({ variables: { data } })}
      />
      {editPost && (
        <PostsEditModal
          post={editPost}
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          authorId={user?.id ? String(user.id) : undefined}
          loading={updating}
          onSubmit={(data) => updatePost({ variables: { data } })}
          onClose={() => setEditPost(null)}
        />
      )}
      <DataTable
        columns={columns}
        data={posts}
        loading={loadingPosts}
        page={page}
        totalPages={totalPages}
        total={total}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        search={search}
        onSearch={handleSearch}
        onDeleteSelected={handleDeleteSelected}
        getRowId={(row: PostRow) => row.id}
      />
    </WrapperPage>
  );
}
