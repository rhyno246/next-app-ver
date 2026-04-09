import { useCartStore } from "@/store/cart-store";
import Link from "next/link";

const OrderSummary = () => {
  const cartItems = useCartStore((state) => state.cartItems);
  const { getTotalPrice } = useCartStore();

  return (
    <div className="lg:max-w-[455px] w-full">
      {/* <!-- order list box --> */}
      <div className="bg-white shadow-1 rounded-[10px]">
        <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
          <h3 className="font-medium text-xl text-dark">Order Summary</h3>
        </div>

        <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
          {/* <!-- title --> */}
          <div className="flex items-center justify-between py-5 border-b border-gray-3">
            <div>
              <h4 className="font-medium text-dark">Product</h4>
            </div>
            <div>
              <h4 className="font-medium text-dark text-right">Subtotal</h4>
            </div>
          </div>

          {cartItems.map((item) => {
            const salePrice =
              item.sale > 0
                ? (item.price - (item.price * item.sale) / 100).toFixed(0)
                : item.price;
            return (
              <div
                key={item.id}
                className="flex items-center justify-between py-5 border-b border-gray-3"
              >
                <div>
                  <p className="text-dark">{item.title}</p>
                </div>
                <div>
                  <p className="text-dark text-right">${salePrice}</p>
                  {/* ${item.discountedPrice * item.quantity} */}
                </div>
              </div>
            );
          })}

          {/* <!-- total --> */}
          <div className="flex items-center justify-between pt-5">
            <div>
              <p className="font-medium text-lg text-dark">Total</p>
            </div>
            <div>
              <p className="font-medium text-lg text-dark text-right">
                ${getTotalPrice()}
              </p>
            </div>
          </div>

          {/* <!-- checkout button --> */}
          <Link
            href="/checkout"
            className="w-full cursor-pointer flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5"
          >
            Process to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
