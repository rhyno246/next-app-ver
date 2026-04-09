"use client";

import { useState } from "react";
import WrapperPage from "../WrapperPage";
import { SettingRow, settingsColumns } from "./SettingsColumns";
import { usePagination } from "@/hooks/usePagination";
import { MeResponse, SettingResponse } from "@/types/type";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  GET_ME,
  GET_SITE_CONFIG,
  GET_SITE_CONFIG_MULTI,
  GET_SITE_CONFIGS,
} from "@/graphql/queries";
import DataTable from "../DataTable/DataTable";
import {
  DELETE_SITE_CONFIG,
  DELETE_SITE_CONFIGS,
  UPDATE_SITE_CONFIG,
  UPDATE_SITE_CONFIGS,
} from "@/graphql/mutations";
import { Toast } from "@/utils/toast";
import SettingsCreateModal from "./SettingsCreateModal";
import SettingsEditModal from "./SettingsEditModal";

const breadcrumbs = [
  { label: "Home", href: "/admin/dashboard" },
  { label: "Settings" },
];
export default function Settings() {
  const [editSetting, setEditSetting] = useState<SettingRow | null>(null);
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
      query: GET_SITE_CONFIGS,
      variables: { page, pageSize, search: debouncedSearch },
    },
    {
      query: GET_SITE_CONFIG,
      variables: { page, pageSize, search: debouncedSearch },
    },
    {
      query: GET_SITE_CONFIG_MULTI,
    },
  ];

  const { data: settingData, loading: loadingSlides } =
    useQuery<SettingResponse>(GET_SITE_CONFIGS, {
      variables: { page, pageSize, search: debouncedSearch },
      fetchPolicy: "network-only",
    });

  const [createSettings, { loading: creataSetingLoading }] = useMutation(
    UPDATE_SITE_CONFIGS,
    {
      refetchQueries,
      onCompleted: () => Toast.success("Config created successfully"),
      onError: (error) => Toast.error(error.message),
    },
  );

  const [upsertSiteConfig, { loading: updating }] = useMutation(
    UPDATE_SITE_CONFIG,
    {
      refetchQueries,
      onCompleted: () => {
        Toast.success("Config updated successfully");
        setEditSetting(null);
        setIsEditOpen(false);
      },
      onError: (error) => Toast.error(error.message),
    },
  );

  const handleEdit = (slide: SettingRow) => {
    setEditSetting(slide);
    setIsEditOpen(true);
  };

  const [deleteSiteConfig] = useMutation(DELETE_SITE_CONFIG, {
    refetchQueries,
    onCompleted: () => Toast.success("Config deleted successfully"),
    onError: (error) => Toast.error(error.message),
  });

  const [deleteSiteConfigs] = useMutation(DELETE_SITE_CONFIGS, {
    refetchQueries,
    onCompleted: () => Toast.success("Config deleted successfully"),
    onError: (error) => Toast.error(error.message),
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure?")) deleteSiteConfig({ variables: { id } });
  };

  const handleDeleteSelected = (ids: string[]) => {
    deleteSiteConfigs({ variables: { ids } });
  };

  const siteConfigs = settingData?.siteConfigs?.data ?? [];
  const totalPages = settingData?.siteConfigs?.totalPages ?? 1;
  const total = settingData?.siteConfigs?.total ?? 0;
  const columns = settingsColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });
  return (
    <WrapperPage title="Settings" breadcrumbs={breadcrumbs}>
      <SettingsCreateModal
        authorId={user?.id ? String(user.id) : undefined}
        loading={creataSetingLoading}
        onSubmit={(configs) => createSettings({ variables: { configs } })}
      />
      {editSetting && (
        <SettingsEditModal
          key={`${editSetting.key}-${editSetting.value}`}
          editSetting={editSetting}
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          authorId={user?.id ? String(user.id) : undefined}
          loading={updating}
          onSubmit={(configs) => upsertSiteConfig({ variables: { configs } })}
          onClose={() => setEditSetting(null)}
        />
      )}
      <DataTable
        columns={columns}
        data={siteConfigs}
        loading={loadingSlides}
        page={page}
        totalPages={totalPages}
        total={total}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        search={search}
        onSearch={handleSearch}
        onDeleteSelected={handleDeleteSelected}
        getRowId={(row: SettingRow) => row.id}
      />
    </WrapperPage>
  );
}
