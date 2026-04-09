import CustomInput from "@/components/Common/CustomInput";
import { UPDATE_SHIPPING_ADDRESS } from "@/graphql/mutations";
import { GET_ME } from "@/graphql/queries";
import {
  shippingAddressSchema,
  ShippingAddressSchema,
} from "@/schema/shippingAddressSchema";
import { MeResponse, ShippingAddressType } from "@/types/type";
import { Toast } from "@/utils/toast";
import { useMutation, useQuery } from "@apollo/client/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type propsModal = {
  isOpen?: boolean;
  closeModal: () => void;
};

const AddressModal = ({ isOpen, closeModal }: propsModal) => {
  const { data: userData } = useQuery<MeResponse>(GET_ME, {
    fetchPolicy: "network-only",
  });

  const user = userData?.me;
  const shipping = user?.shippingAddress;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest(".modal-content")) {
        closeModal();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, closeModal]);

  const { control, handleSubmit, reset } = useForm<ShippingAddressSchema>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  const [updateShippingAddress, { loading }] = useMutation<ShippingAddressType>(
    UPDATE_SHIPPING_ADDRESS,
    {
      refetchQueries: [{ query: GET_ME }],
      onCompleted: (data) => {
        if (data) {
          Toast.success("Update info success");
        }
      },
      onError: (error) => {
        Toast.error(error.message);
      },
    },
  );

  const onSubmit: SubmitHandler<ShippingAddressSchema> = (data) => {
    updateShippingAddress({
      variables: {
        data: {
          ...data,
          authorId: user?.id,
        },
      },
    });
    reset();
    closeModal();
  };

  useEffect(() => {
    if (shipping) {
      reset({
        name: shipping.name || "",
        email: shipping.email || "",
        phone: shipping.phone || "",
        address: shipping.address || "",
      });
    }
  }, [shipping, reset]);

  useEffect(() => {
    if (!shipping && user) {
      const name = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
      reset({
        name,
        email: user.email || "",
        phone: user.phone || "",
        address: "",
      });
    }
  }, [shipping, user, reset]);
  return (
    <div
      className={`fixed top-0 left-0 overflow-y-auto no-scrollbar w-full h-screen sm:py-20 xl:py-25 2xl:py-57-5 bg-dark/70 sm:px-8 px-4 py-5 ${
        isOpen ? "block z-99999" : "hidden"
      }`}
    >
      <div className="flex items-center justify-center ">
        <div
          x-show="addressModal"
          className="w-full max-w-275 rounded-xl shadow-3 bg-white p-7-5 relative modal-content"
        >
          <button
            onClick={closeModal}
            aria-label="button for close modal"
            className="absolute top-0 right-0 sm:top-3 sm:right-3 flex items-center justify-center w-10 h-10 rounded-full ease-in duration-150 bg-meta text-body hover:text-dark"
          >
            <svg
              className="fill-current"
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.3108 13L19.2291 8.08167C19.5866 7.72417 19.5866 7.12833 19.2291 6.77083C19.0543 6.59895 18.8189 6.50262 18.5737 6.50262C18.3285 6.50262 18.0932 6.59895 17.9183 6.77083L13 11.6892L8.08164 6.77083C7.90679 6.59895 7.67142 6.50262 7.42623 6.50262C7.18104 6.50262 6.94566 6.59895 6.77081 6.77083C6.41331 7.12833 6.41331 7.72417 6.77081 8.08167L11.6891 13L6.77081 17.9183C6.41331 18.2758 6.41331 18.8717 6.77081 19.2292C7.12831 19.5867 7.72414 19.5867 8.08164 19.2292L13 14.3108L17.9183 19.2292C18.2758 19.5867 18.8716 19.5867 19.2291 19.2292C19.5866 18.8717 19.5866 18.2758 19.2291 17.9183L14.3108 13Z"
                fill=""
              />
            </svg>
          </button>

          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
                <div className="w-full">
                  <CustomInput
                    control={control}
                    name="name"
                    label="Name"
                    placeholder="type Name"
                  />
                </div>

                <div className="w-full">
                  <CustomInput
                    control={control}
                    name="email"
                    label="Email"
                    placeholder="type Email"
                  />
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
                <div className="w-full">
                  <CustomInput
                    control={control}
                    name="phone"
                    label="Phone"
                    placeholder="type Phone"
                  />
                </div>

                <div className="w-full">
                  <CustomInput
                    control={control}
                    name="address"
                    label="Address"
                    placeholder="type Address"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark"
                disabled={loading ? true : false}
              >
                {loading ? "loading...." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
