"use client";
import Breadcrumb from "@/components/Common/Breadcrumb";
import LoadingComponent from "@/components/Common/LoadingComponent";
import { GET_POST_DETAIL } from "@/graphql/queries";
import { Posts } from "@/types/type";
import { useQuery } from "@apollo/client/react";
import dayjs from "dayjs";
import Image from "next/image";

type Props = {
  slug: string;
};

type PostResponse = {
  postDetail: Posts;
};

const BlogDetails = ({ slug }: Props) => {
  const { data, loading } = useQuery<PostResponse>(GET_POST_DETAIL, {
    variables: { slug },
  });
  if (loading) {
    return <LoadingComponent />;
  }
  return (
    <>
      <Breadcrumb title={"Blog Details"} pages={[`blogs`]} detail={slug} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[750px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="rounded-[10px] overflow-hidden mb-7.5">
            {data?.postDetail.image && (
              <Image
                className="rounded-[10px]"
                src={data?.postDetail.image}
                alt="details"
                width={750}
                height={477}
              />
            )}
          </div>
          <div>
            <span className="flex items-center gap-3 mb-4">
              <span className="ease-out duration-200 hover:text-blue">
                {dayjs(data?.postDetail.createdAt).format("DD/MM/YYYY")}{" "}
              </span>
              <span className="block w-px h-4 bg-gray-4"></span>
              <span className="ease-out duration-200 hover:text-blue">
                {data?.postDetail.author.firstName +
                  " " +
                  data?.postDetail.author.lastName}
              </span>
            </span>
          </div>
          <div
            className="content break-all leading-7"
            dangerouslySetInnerHTML={{ __html: data?.postDetail.content || "" }}
          />
        </div>
      </section>
    </>
  );
};

export default BlogDetails;
