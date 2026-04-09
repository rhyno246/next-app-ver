"use client";

import { GET_ME, GET_MY_ORDERS } from "@/graphql/queries";
import { usePagination } from "@/hooks/usePagination";
import { MeResponse, OrdersResponse } from "@/types/type";
import { useQuery } from "@apollo/client/react";
import SingleOrder from "./SingleOrder";
import { Spinner } from "@/components/ui/spinner";

const Orders = () => {
  const { data: meData } = useQuery<MeResponse>(GET_ME);
  const user = meData?.me;
  const { page, pageSize, debouncedSearch, handlePageChange } = usePagination({
    defaultPageSize: 3,
  });
  const { data, loading } = useQuery<OrdersResponse>(GET_MY_ORDERS, {
    variables: {
      page,
      pageSize,
      search: debouncedSearch,
      authorId: user?.id,
    },
    skip: !user?.id,
    fetchPolicy: "network-only",
  });
  return (
    <>
      {loading ? (
        <div className="flex pt-7 justify-center w-full height-full items-center">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="w-full overflow-x-auto">
            <div className="min-w-[770px]">
              {/* <!-- order item --> */}
              <div className="items-center justify-between py-4.5 px-7.5 hidden md:flex ">
                <div className="min-w-[111px]">
                  <p className="text-custom-sm text-center text-dark">Order</p>
                </div>
                <div className="min-w-[100px]">
                  <p className="text-custom-sm text-center text-dark">Date</p>
                </div>

                <div className="min-w-[128px]">
                  <p className="text-custom-sm text-center text-dark">Status</p>
                </div>
                <div className="min-w-[113px]">
                  <p className="text-custom-sm text-center text-dark">Total</p>
                </div>

                <div className="min-w-[113px]">
                  <p className="text-custom-sm text-center text-dark">Action</p>
                </div>
              </div>
            </div>
          </div>
          {data?.myOrders.data.map((orderItem) => (
            <SingleOrder key={orderItem.id} orderItem={orderItem} />
          ))}
          <div className="flex justify-center mt-1 mb-5 gap-3">
            <button
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            <span className="px-3 py-1">
              Page {page} / {data?.myOrders.totalPages}
            </span>

            <button
              disabled={page === data?.myOrders.totalPages}
              onClick={() => handlePageChange(page + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default Orders;
