"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import LoadingComponent from "@/components/Common/LoadingComponent";
import { GET_ME, GET_WISHLISTS } from "@/graphql/queries";
import { MeResponse, Products } from "@/types/type";
import { useQuery } from "@apollo/client/react";
import SingleItem from "./SingleItem";

type WishlistItem = {
  id: string;
  productId: string;
  authorId: string;
  product: Products;
};

type WishlistResponse = {
  wishlists: WishlistItem[];
};

export default function WishListPage() {
  const { data: meData } = useQuery<MeResponse>(GET_ME);
  const user = meData?.me;
  const { data, loading } = useQuery<WishlistResponse>(GET_WISHLISTS, {
    variables: {
      authorId: user?.id,
    },
  });
  if (loading) {
    return <LoadingComponent />;
  }
  return (
    <>
      <Breadcrumb title={"WishList"} pages={["WishList"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-wrap items-center justify-between gap-5 mb-7.5">
            <h2 className="font-medium text-dark text-2xl">Your Wishlist</h2>
          </div>

          <div className="bg-white rounded-[10px] shadow-1">
            <div className="w-full overflow-x-auto">
              <div className="min-w-[1170px]">
                {/* <!-- table header --> */}
                <div className="flex items-center py-5.5 px-10">
                  <div className="min-w-[83px]"></div>
                  <div className="min-w-[387px]">
                    <p className="text-dark">Product</p>
                  </div>

                  <div className="min-w-[205px]">
                    <p className="text-dark">Unit Price</p>
                  </div>

                  <div className="min-w-[265px]">
                    <p className="text-dark">Stock Status</p>
                  </div>

                  <div className="min-w-[150px]">
                    <p className="text-dark text-right">Action</p>
                  </div>
                </div>

                {/* <!-- wish item --> */}
                {data?.wishlists.map((item) => (
                  <SingleItem item={item} key={item.id} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
