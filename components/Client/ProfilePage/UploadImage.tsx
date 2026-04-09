"use client";

import { UPDATE_CLIENT_AUTHOR } from "@/graphql/mutations";
import { GET_ME } from "@/graphql/queries";
import { Author, UpdateAuthor } from "@/types/type";
import { Toast } from "@/utils/toast";
import { useMutation } from "@apollo/client/react";
import Image from "next/image";
import { useState } from "react";

type Props = {
  user: Author | null | undefined;
};

export default function UploadImage({ user }: Props) {
  const preview = user?.image || "/images/users/user-04.jpg";
  const [uploading, setUploading] = useState(false);

  const [updateAuthor] = useMutation<UpdateAuthor>(UPDATE_CLIENT_AUTHOR, {
    refetchQueries: [{ query: GET_ME }], // refecth lại hàm GETME
    onCompleted: (data) => {
      if (data) {
        Toast.success("Upadte info success");
      }
    },
    onError: (error) => {
      Toast.error(error.message);
    },
  });

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("currentImage", user?.image ?? "");
    formData.append("currentPublicId", user?.publicId ?? "");
    formData.append("folder", "avatars");
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (data.unchanged) return;
    updateAuthor({
      variables: {
        data: {
          id: user?.id,
          image: data.url,
          publicId: data.public_id,
        },
      },
    });
    setUploading(false);
  };

  return (
    <div className="relative w-16 h-16 rounded-full overflow-hidden cursor-pointer">
      <Image
        src={preview}
        alt="user"
        width={64}
        height={64}
        className="object-cover h-full"
      />

      {uploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-blue border-t-transparent"></div>
        </div>
      )}
      <label className="absolute inset-0  cursor-pointer">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUploadImage}
        />
      </label>
    </div>
  );
}
