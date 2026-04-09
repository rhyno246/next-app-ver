// CommentsSection.tsx
"use client";
import { GET_COMMENTS } from "@/graphql/queries";
import { useQuery } from "@apollo/client/react";
import Image from "next/image";
import dayjs from "dayjs";
import { CommentsResponse } from "@/types/type";

export default function CommentsSection({ productId }: { productId: string }) {
  const { data, loading } = useQuery<CommentsResponse>(GET_COMMENTS, {
    variables: { productId },
  });

  const comments = data?.getComments ?? [];

  if (loading) return <div className="text-dark-4">Loading reviews...</div>;

  return (
    <div>
      <h2 className="font-medium text-2xl text-dark mb-9">
        {comments.length} Review{comments.length !== 1 ? "s" : ""} for this
        product
      </h2>

      {comments.length === 0 ? (
        <p className="text-dark-4">No reviews yet.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-xl bg-white shadow-1 p-4 sm:p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12.5 h-12.5 rounded-full overflow-hidden bg-gray-2 flex items-center justify-center">
                    {comment.author?.image ? (
                      <Image
                        src={comment.author.image}
                        alt={comment.name}
                        width={50}
                        height={50}
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-dark font-medium text-lg">
                        {comment.name?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-dark">{comment.name}</h3>
                    <p className="text-custom-sm text-dark-4">
                      {dayjs(comment.createdAt).format("DD/MM/YYYY")}
                    </p>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`fill-current ${star <= comment.rating ? "text-[#FFA645]" : "text-gray-3"}`}
                      width="15"
                      height="15"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_375_9172)">
                        <path
                          d="M16.7906 6.72187L11.7 5.93438L9.39377 1.09688C9.22502 0.759375 8.77502 0.759375 8.60627 1.09688L6.30002 5.9625L1.23752 6.72187C0.871891 6.77812 0.731266 7.25625 1.01252 7.50938L4.69689 11.3063L3.82502 16.6219C3.76877 16.9875 4.13439 17.2969 4.47189 17.0719L9.05627 14.5687L13.6125 17.0719C13.9219 17.2406 14.3156 16.9594 14.2313 16.6219L13.3594 11.3063L17.0438 7.50938C17.2688 7.25625 17.1563 6.77812 16.7906 6.72187Z"
                          fill=""
                        />
                      </g>
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-dark mt-4">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
