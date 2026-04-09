"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import { MeResponse } from "@/types/type";
import {
  GET_ME,
  GET_MONTHLY_ORDERS,
  GET_PRODUCT_DETAIL,
} from "@/graphql/queries";
import { useMutation, useQuery } from "@apollo/client/react";
import { useCartStore } from "@/store/cart-store";
import { useRouter } from "next/navigation";
import { checkoutSchema, CheckoutSchema } from "@/schema/checkoutSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { CREATE_ORDER } from "@/graphql/mutations";
import { Toast } from "@/utils/toast";
import CustomInput from "@/components/Common/CustomInput";
import ShippingMethod from "./ShippingMethod";
import { useState } from "react";
type CreateOrderResponse = {
  createOrder: {
    id: string;
    code: number;
  };
};

export default function CheckOutPage() {
  const { data: meData } = useQuery<MeResponse>(GET_ME);
  const user = meData?.me;
  const cart = useCartStore((state) => state.cartItems);
  const { getTotalPrice, removeAllItemCart } = useCartStore();
  const router = useRouter();

  const [shippingMethod, setShippingMethod] = useState("free");

  // Tính shippingFee để hiển thị
  const shippingFeeDisplay: Record<string, number> = {
    free: 0,
    fedex: 11, // cents
    dhl: 13, // cents
  };
  const shippingFee = shippingFeeDisplay[shippingMethod] ?? 0;

  const { control, handleSubmit, reset } = useForm<CheckoutSchema>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      address: user?.shippingAddress?.address ?? "",
      phone: user?.phone ?? "",
      email: user?.email ?? "",
      note: "",
    },
  });

  const refetchQueries = [
    {
      query: GET_PRODUCT_DETAIL,
    },
    {
      query: GET_MONTHLY_ORDERS,
    },
  ];

  const [createOrder, { loading }] = useMutation<CreateOrderResponse>(
    CREATE_ORDER,
    {
      refetchQueries,
      onCompleted: (data) => {
        Toast.success(`Order #${data.createOrder.code} placed successfully!`);
        removeAllItemCart();
        reset();
        if (user?.id) {
          router.push(`/profile?tab=orders`);
        } else {
          router.push(`/shop`);
        }
      },
      onError: (error) => Toast.error(error.message),
    },
  );

  const onSubmit: SubmitHandler<CheckoutSchema> = (data) => {
    if (cart.length === 0) {
      Toast.error("Your cart is empty");
      return;
    }

    createOrder({
      variables: {
        data: {
          authorId: user?.id ?? null,
          shippingName: `${data.firstName} ${data.lastName}`,
          shippingPhone: data.phone,
          shippingEmail: data.email,
          shippingAddress: data.address,
          note: data.note,
          paymentMethod: shippingMethod,
          discount: 0,
          shippingFee: 0,
          items: cart.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
            sale: item.sale ?? 0,
          })),
        },
      },
    });
  };

  return (
    <>
      <Breadcrumb title={"Checkout"} pages={["checkout"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11 mt-7">
              {/* <!-- checkout left --> */}

              <div className="lg:max-w-[670px] w-full">
                <div>
                  <h2 className="font-medium text-dark text-xl sm:text-2xl mb-5.5">
                    Billing details
                  </h2>

                  <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5">
                    <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
                      <div className="w-full">
                        <CustomInput
                          control={control}
                          name="firstName"
                          label="First Name *"
                          placeholder="John"
                        />
                      </div>
                      <div className="w-full">
                        <CustomInput
                          control={control}
                          name="lastName"
                          label="Last Name *"
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <CustomInput
                      control={control}
                      name="address"
                      label="Address *"
                      placeholder="House number and street name"
                    />

                    <CustomInput
                      control={control}
                      name="phone"
                      label="Phone *"
                      placeholder="Your phone number"
                    />

                    <CustomInput
                      control={control}
                      name="email"
                      label="Email Address *"
                      placeholder="Your email"
                      type="email"
                    />
                  </div>
                </div>

                {/* <!-- others note box --> */}
                <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5 mt-7.5">
                  <CustomInput
                    control={control}
                    name="note"
                    label="Other Notes (optional)"
                    placeholder="Notes about your order, e.g. special notes for delivery."
                  />
                </div>
              </div>
              {/* {cart.length > 0 && <Shipping />} */}

              {cart.length > 0 ? (
                <div className="max-w-[455px] w-full">
                  {/* <!-- order list box --> */}
                  <div className="bg-white shadow-1 rounded-[10px]">
                    <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
                      <h3 className="font-medium text-xl text-dark">
                        Your Order
                      </h3>
                    </div>

                    <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
                      {/* <!-- title --> */}
                      <div className="flex items-center justify-between py-5 border-b border-gray-3">
                        <div>
                          <h4 className="font-medium text-dark">Product</h4>
                        </div>
                        <div>
                          <h4 className="font-medium text-dark text-right">
                            Subtotal
                          </h4>
                        </div>
                      </div>

                      {/* <!-- product item --> */}
                      {cart.map((item) => {
                        const sale = item.sale ?? 0;
                        const finalPrice =
                          sale > 0
                            ? item.price - (item.price * sale) / 100
                            : item.price;
                        return (
                          <div
                            key={item.id}
                            className="flex items-center justify-between py-5 border-b border-gray-3"
                          >
                            <p className="text-dark">
                              {item.title}{" "}
                              <span className="text-dark-4 text-red">
                                x{item.quantity}
                              </span>
                            </p>
                            <p className="text-dark text-right">
                              ${(finalPrice * item.quantity).toFixed(0)}
                            </p>
                          </div>
                        );
                      })}

                      <div className="flex items-center justify-between py-3 border-b border-gray-3">
                        <p className="text-dark">Shipping</p>
                        <p className="text-dark">
                          {shippingFee === 0 ? "Free" : `$${shippingFee}`}
                        </p>
                      </div>

                      {/* <!-- total --> */}
                      <div className="flex items-center justify-between pt-5">
                        <div>
                          <p className="font-medium text-lg text-dark">Total</p>
                        </div>
                        <div>
                          <p className="font-medium text-lg text-dark text-right">
                            ${(getTotalPrice() + shippingFee).toFixed(0)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <ShippingMethod
                    value={shippingMethod}
                    onChange={setShippingMethod}
                  />

                  {/* <!-- checkout button --> */}
                  <button
                    disabled={loading}
                    type="submit"
                    className="w-full flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5"
                  >
                    {loading ? "Processing..." : "Process to Checkout"}
                  </button>
                </div>
              ) : (
                <div className="max-w-[455px] w-full flex items-center justify-center">
                  <p className="text-dark-4">Your cart is empty</p>
                </div>
              )}
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
