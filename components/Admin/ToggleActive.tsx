"use client";
import { Switch } from "@/components/ui/switch";
import { useMutation } from "@apollo/client/react";
import { Toast } from "@/utils/toast";
import { DocumentNode } from "@apollo/client";

type Props = {
  id: string;
  isActive: boolean;
  mutation: DocumentNode;
  refetchQueries?: { query: DocumentNode; variables?: object }[];
};

export default function ToggleActive({
  id,
  isActive,
  mutation,
  refetchQueries,
}: Props) {
  const [update, { loading }] = useMutation(mutation, {
    refetchQueries,
    onCompleted: () => Toast.success("Updated successfully"),
    onError: (error) => Toast.error(error.message),
  });
  return (
    <Switch
      checked={isActive}
      disabled={loading}
      onCheckedChange={(checked) => {
        update({
          variables: {
            data: {
              id,
              isActive: checked,
            },
          },
        });
      }}
    />
  );
}
