"use client";
import { Switch } from "@/components/ui/switch";
import { useMutation } from "@apollo/client/react";
import { Toast } from "@/utils/toast";
import { DocumentNode } from "@apollo/client";

type Props = {
  id: string;
  isHot: boolean;
  mutation: DocumentNode;
  refetchQueries?: { query: DocumentNode; variables?: object }[];
};

export default function ToggleIsHot({
  id,
  isHot,
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
      checked={isHot}
      disabled={loading}
      onCheckedChange={(checked) => {
        update({
          variables: {
            id,
            isHot: checked,
          },
        });
      }}
    />
  );
}
