import { OrdersData } from "@/types/type";
import dayjs from "dayjs";
import React, { useState } from "react";
import OrderModal from "./OrderModal";
import OrderActions from "./OrderActions";

const SingleOrder = ({ orderItem }: { orderItem: OrdersData }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const toggleModal = (status: boolean) => {
    setShowDetails(status);
    setShowEdit(status);
  };

  return (
    <>
      <div className="items-center justify-between border-t border-gray-3 py-5 px-7.5 hidden md:flex">
        <div className="max-w-[110px]">
          <p className="text-custom-sm text-center text-red">{orderItem.id}</p>
        </div>
        <div className="min-w-[90px]">
          <p className="text-custom-sm text-center text-dark">
            {dayjs(orderItem.createdAt).format("MMM DD, YYYY")}
          </p>
        </div>

        <div className="min-w-[128px]">
          <p
            className={`inline-block text-custom-sm text-center  py-0.5 px-2.5 rounded-[30px] capitalize ${
              orderItem.status === "PENDING"
                ? "bg-yellow-50 border-yellow-300 text-yellow-700"
                : orderItem.status === "CONFIRMED"
                  ? "bg-blue-50 border-blue-300 text-blue-700"
                  : orderItem.status === "SHIPPING"
                    ? "bg-purple-50 border-purple-300 text-purple-700"
                    : orderItem.status === "SHIPPED"
                      ? "bg-green-50 border-green-300 text-green-700"
                      : orderItem.status === "CANCELLED"
                        ? "bg-red-50 border-red-300 text-red-700"
                        : "bg-gray-50 border-gray-300 text-gray-700"
            }`}
          >
            {orderItem.status}
          </p>
        </div>

        <div className="min-w-[113px]">
          <p className="text-custom-sm text-center text-dark">
            ${orderItem.total}
          </p>
        </div>

        <div className="flex gap-5 items-center text-center">
          <OrderActions toggleDetails={toggleDetails} />
        </div>
      </div>

      <OrderModal
        showDetails={showDetails}
        showEdit={showEdit}
        toggleModal={toggleModal}
        order={orderItem}
      />
    </>
  );
};

export default SingleOrder;
