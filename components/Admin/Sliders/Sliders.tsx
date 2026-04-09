"use client";
import WrapperPage from "../WrapperPage";
import { useMutation, useQuery } from "@apollo/client/react";
import { GET_ME, GET_SLIDES } from "@/graphql/queries";
import {
  CREATE_SLIDE,
  DELETE_SLIDE,
  DELETE_SLIDES,
  UPDATE_SLIDE,
} from "@/graphql/mutations";
import { MeResponse } from "@/types/type";
import { usePagination } from "@/hooks/usePagination";
import DataTable from "../DataTable/DataTable";
import SlideCreateModal from "./SlideCreateModal";
import SlideEditModal from "./SlideEditModal";
import { Toast } from "@/utils/toast";
import { useState } from "react";
import { slideColumns, SlideRow } from "./SlideColumns";

const breadcrumbs = [
  { label: "Home", href: "/admin/dashboard" },
  { label: "Sliders" },
];

type SlidesResponse = {
  slides: {
    data: SlideRow[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
};

export default function Sliders() {
  const [editSlide, setEditSlide] = useState<SlideRow | null>(null);
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
      query: GET_SLIDES,
      variables: { page, pageSize, search: debouncedSearch },
    },
  ];

  const { data: slidesData, loading: loadingSlides } = useQuery<SlidesResponse>(
    GET_SLIDES,
    {
      variables: { page, pageSize, search: debouncedSearch },
      fetchPolicy: "network-only",
    },
  );

  const [createSlide, { loading: creating }] = useMutation(CREATE_SLIDE, {
    refetchQueries,
    onCompleted: () => Toast.success("Slide created successfully"),
    onError: (error) => Toast.error(error.message),
  });

  const [updateSlide, { loading: updating }] = useMutation(UPDATE_SLIDE, {
    refetchQueries,
    onCompleted: () => {
      Toast.success("Slide updated successfully");
      setEditSlide(null);
      setIsEditOpen(false);
    },
    onError: (error) => Toast.error(error.message),
  });

  const [deleteSlide] = useMutation(DELETE_SLIDE, {
    refetchQueries,
    onCompleted: () => Toast.success("Slide deleted successfully"),
    onError: (error) => Toast.error(error.message),
  });

  const [deleteSlides] = useMutation(DELETE_SLIDES, {
    refetchQueries,
    onCompleted: () => Toast.success("Slides deleted successfully"),
    onError: (error) => Toast.error(error.message),
  });

  const handleEdit = (slide: SlideRow) => {
    setEditSlide(slide);
    setIsEditOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure?")) deleteSlide({ variables: { id } });
  };

  const handleDeleteSelected = (ids: string[]) => {
    deleteSlides({ variables: { ids } });
  };

  const slides = slidesData?.slides?.data ?? [];
  const totalPages = slidesData?.slides?.totalPages ?? 1;
  const total = slidesData?.slides?.total ?? 0;
  const columns = slideColumns({ onEdit: handleEdit, onDelete: handleDelete });

  return (
    <WrapperPage title="Sliders" breadcrumbs={breadcrumbs}>
      <div className="flex gap-2 mb-4">
        <SlideCreateModal
          authorId={user?.id ? String(user.id) : undefined}
          loading={creating}
          onSubmit={(data) => createSlide({ variables: { data } })}
        />
        {editSlide && (
          <SlideEditModal
            slide={editSlide}
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
            authorId={user?.id ? String(user.id) : undefined}
            loading={updating}
            onSubmit={(data) => updateSlide({ variables: { data } })}
            onClose={() => setEditSlide(null)}
          />
        )}
      </div>

      <DataTable
        columns={columns}
        data={slides}
        loading={loadingSlides}
        page={page}
        totalPages={totalPages}
        total={total}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        search={search}
        onSearch={handleSearch}
        onDeleteSelected={handleDeleteSelected}
        getRowId={(row: SlideRow) => row.id}
      />
    </WrapperPage>
  );
}
