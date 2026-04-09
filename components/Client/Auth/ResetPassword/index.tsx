"use client";
import Breadcrumb from "@/components/Common/Breadcrumb";
import CustomInput from "@/components/Common/CustomInput";
import { RESET_PASSWORD } from "@/graphql/mutations";
import {
  resetPasswordSchema,
  ResetPasswordSchema,
} from "@/schema/resetPasswordSchema";
import { Toast } from "@/utils/toast";
import { useMutation } from "@apollo/client/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { control, handleSubmit, reset } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newpassword: "",
      cfnewpassword: "",
    },
  });
  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD, {
    onCompleted: () => {
      Toast.success("Password reset successfully");
      reset();
      router.push("/signin"); // ✅ redirect về login
    },
    onError: (error) => {
      Toast.error(error.message);
    },
  });

  const onSubmit: SubmitHandler<ResetPasswordSchema> = async (data) => {
    if (!token) {
      Toast.error("Invalid or expired token");
      return;
    }
    await resetPassword({
      variables: {
        data: {
          token,
          newPassword: data.newpassword,
        },
      },
    });
  };
  return (
    <>
      <Breadcrumb title={"Reset Password"} pages={["Reset Password"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-292.5 w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-142-5 w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7-5 xl:p-11">
            <div className="text-center mb-11">
              <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5">
                Reset Password
              </h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <CustomInput
                type="password"
                control={control}
                name="newpassword"
                label="New Password"
                placeholder="Type New Password"
              />
              <CustomInput
                type="password"
                control={control}
                name="cfnewpassword"
                label="Cf New Password"
                placeholder="Type Cf New Password"
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
