import { OrdersData } from "@/types/type";
import dayjs from "dayjs";
import Link from "next/link";

const OrderDetails = ({ orderItem }: { orderItem: OrdersData }) => {
  console.log(orderItem);
  return (
    <div className="h-full max-h-[300px] overflow-auto ">
      <div className="items-center justify-between py-4.5 px-7.5 hidden md:flex ">
        <div className="min-w-[113px]">
          <p className="text-custom-sm text-dark">Order</p>
        </div>
        <div className="min-w-[113px]">
          <p className="text-custom-sm text-dark">Date</p>
        </div>

        <div className="min-w-[113px]">
          <p className="text-custom-sm text-dark">Comments</p>
        </div>
        <div className="min-w-[113px]">
          <p className="text-custom-sm text-dark">Total</p>
        </div>
      </div>
      {orderItem.items.map((item) => (
        <div
          key={item.id}
          className="items-center justify-between border-t border-gray-3 py-5 px-7.5 hidden md:flex"
        >
          <div className="max-w-[100px]">
            <p className="text-custom-sm text-red">#{item.id}</p>
          </div>
          <div className="min-w-[100px]">
            <p className="text-custom-sm text-dark">
              {dayjs(orderItem.createdAt).format("MMM DD, YYYY")}
            </p>
          </div>

          <div className="min-w-[128px]">
            <p className="text-center">
              {orderItem.status === "SHIPPED" && (
                <Link
                  href={`/shop/${item.product.slug}?rating=view&shipingEmail=${orderItem.shippingEmail}&shippingName=${orderItem.shippingName}`}
                >
                  <span className="text-custom-sm text-dark underline">
                    Write
                  </span>
                </Link>
              )}
            </p>
          </div>

          <div className="min-w-[113px]">
            <p className="text-custom-sm text-dark">${item.total}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderDetails;
