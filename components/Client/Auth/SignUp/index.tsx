"use client";
import Breadcrumb from "@/components/Common/Breadcrumb";
import CustomInput from "@/components/Common/CustomInput";
import { SignupSchema, signupSchema } from "@/schema/registerSchema";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@apollo/client/react";
import { CREATE_AUTHOR } from "@/graphql/mutations";
import { Toast } from "@/utils/toast";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const SignUpComponent = () => {
  const router = useRouter();
  const { control, handleSubmit, reset } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
    },
  });

  const [createAuthor, { loading, error }] = useMutation(CREATE_AUTHOR);

  const onSubmit: SubmitHandler<SignupSchema> = (data) => {
    createAuthor({
      variables: { data },
    });
    reset();
    router.push("/signin");
  };
  useEffect(() => {
    if (error) {
      Toast.error(error?.message);
    }
  }, [error]);
  return (
    <>
      <Breadcrumb title={"Sign Up"} pages={["Sign up"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-292.5 w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-142-5 w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7-5 xl:p-11">
            <div className="text-center mb-11">
              <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5">
                Sign Up
              </h2>
              <p>Enter your detail below </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <CustomInput
                control={control}
                name="firstName"
                label="First Name"
                placeholder="type First Name"
              />

              <CustomInput
                control={control}
                name="lastName"
                label="Last Name"
                placeholder="Type Last Name"
              />
              <CustomInput
                control={control}
                name="email"
                label="Email"
                placeholder="Type Email"
              />

              <CustomInput
                control={control}
                name="password"
                label="Password"
                placeholder="Type Password"
                type="password"
              />

              <CustomInput
                control={control}
                name="phone"
                label="Phone"
                placeholder="Type Phone"
              />

              <button
                type="submit"
                className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg ease-out duration-200 hover:bg-blue mt-7-5"
                disabled={loading ? true : false}
              >
                {loading ? "Loading..." : "Sign in to account"}
              </button>

              <a
                href="#"
                className="block text-center text-dark-4 mt-4-5 ease-out duration-200 hover:text-dark"
              >
                Forget your password?
              </a>

              <span className="relative z-1 block font-medium text-center mt-4-5">
                <span className="block absolute -z-1 left-0 top-1/2 h-px w-full bg-gray-3"></span>
                <span className="inline-block px-3 bg-white">Or</span>
              </span>

              <p className="text-center mt-6">
                I have already account?
                <Link
                  href="/signin"
                  className="text-dark ease-out duration-200 hover:text-blue pl-2"
                >
                  Sign In Now!
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};
