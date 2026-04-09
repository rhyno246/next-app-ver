"use client";
import Breadcrumb from "@/components/Common/Breadcrumb";
import CustomInput from "@/components/Common/CustomInput";
import { FORGET_PASSWORD } from "@/graphql/mutations";
import {
  forgetPasswordSchema,
  ForgetPasswordSchema,
} from "@/schema/forgetPasswordSchema";
import { Toast } from "@/utils/toast";
import { useMutation } from "@apollo/client/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

export default function ForgetPassword() {
  const { control, handleSubmit, reset } = useForm<ForgetPasswordSchema>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const [forgetPassword, { loading }] = useMutation(FORGET_PASSWORD, {
    onCompleted: () => {
      Toast.success("Reset password email sent, please check your email");
      reset();
    },
    onError: (error) => {
      Toast.error(error.message);
    },
  });

  const onSubmit: SubmitHandler<ForgetPasswordSchema> = async (data) => {
    await forgetPassword({
      variables: {
        data: {
          email: data.email,
        },
      },
    });
  };
  return (
    <>
      <Breadcrumb title={"Forget Password"} pages={["Forget Password"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-292.5 w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-142-5 w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7-5 xl:p-11">
            <div className="text-center mb-11">
              <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5">
                Forget Password
              </h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <CustomInput
                control={control}
                name="email"
                label="Email"
                placeholder="Type Email"
              />
              <button
                type="submit"
                className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg ease-out duration-200 hover:bg-blue mt-7-5"
                disabled={loading ? true : false}
              >
                {loading ? "loading...." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
