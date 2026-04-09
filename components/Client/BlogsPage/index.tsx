"use client";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { GET_POSTS } from "@/graphql/queries";
import { PostsResponse } from "@/types/type";
import BlogItem from "./BlockItem";
import LoadingComponent from "@/components/Common/LoadingComponent";
import { useInfiniteQuery } from "@/hooks/useInfiniteQuery";
import InfiniteScroll from "react-infinite-scroll-component";

const BlogsPage = () => {
  const { allItems, loading, hasMore, fetchMore, page } = useInfiniteQuery<
    PostsResponse,
    PostsResponse["posts"]["data"][0]
  >(GET_POSTS, "posts", { pageSize: 6 });
  if (loading && page === 1) {
    return <LoadingComponent />;
  }
  return (
    <>
      <Breadcrumb title={"Blog"} pages={["blogs"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-292.5 w-full mx-auto px-4 sm:px-8 xl:px-0">
          <InfiniteScroll
            dataLength={allItems.length}
            next={fetchMore}
            hasMore={hasMore}
            loader={<></>}
            endMessage={<></>}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-7-5"
          >
            {allItems.map((blog) => (
              <BlogItem blog={blog} key={blog.id} />
            ))}
          </InfiniteScroll>
          {loading && page > 1 && (
            <div className="flex justify-center mt-10">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-blue border-t-transparent" />
            </div>
          )}
          {!hasMore && allItems.length > 0 && (
            <p className="text-center mt-10 text-dark-4">No more posts</p>
          )}
        </div>
      </section>
    </>
  );
};
export default BlogsPage;
