import CustomInput from "@/components/Common/CustomInput";
import { LOGIN_AUHOR } from "@/graphql/mutations";
import { loginSchema, LoginSchema } from "@/schema/loginSchema";
import { useUserStore } from "@/store/user-store";
import { LoginAuthResponse } from "@/types/type";
import { Toast } from "@/utils/toast";
import { useMutation } from "@apollo/client/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const Login = () => {
  const [dropdown, setDropdown] = useState(false);
  const { control, handleSubmit, reset } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [loginAuth, { loading, error }] = useMutation<LoginAuthResponse>(
    LOGIN_AUHOR,
    {
      onCompleted: (data) => {
        const user = data?.loginAuth?.user;
        if (user) {
          useUserStore.getState().setUser(user);
          reset();
        }
      },
      onError: (error) => {
        Toast.error(error.message);
      },
    },
  );

  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    loginAuth({ variables: { data } });
  };

  useEffect(() => {
    if (error) {
      Toast.error(error?.message);
    }
  }, [error]);
  return (
    <div className="bg-white shadow-1 rounded-[10px]">
      <div
        onClick={() => setDropdown(!dropdown)}
        className={`cursor-pointer flex items-center gap-0.5 py-5 px-5.5 ${
          dropdown && "border-b border-gray-3"
        }`}
      >
        Returning customer?
        <span className="flex items-center gap-2.5 pl-1 font-medium text-dark">
          Click here to login
          <svg
            className={`${
              dropdown && "rotate-180"
            } fill-current ease-out duration-200`}
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.06103 7.80259C4.30813 7.51431 4.74215 7.48092 5.03044 7.72802L10.9997 12.8445L16.9689 7.72802C17.2572 7.48092 17.6912 7.51431 17.9383 7.80259C18.1854 8.09088 18.1521 8.5249 17.8638 8.772L11.4471 14.272C11.1896 14.4927 10.8097 14.4927 10.5523 14.272L4.1356 8.772C3.84731 8.5249 3.81393 8.09088 4.06103 7.80259Z"
              fill=""
            />
          </svg>
        </span>
      </div>

      {/* <!-- dropdown menu --> */}
      <div
        className={`${
          dropdown ? "block" : "hidden"
        } pt-7.5 pb-8.5 px-4 sm:px-8.5`}
      >
        <div className="flex flex-col gap-4-5 mb-3">
          <button
            onClick={() => signIn("google")}
            className="flex justify-center items-center gap-3.5 rounded-lg border border-gray-3 bg-gray-1 p-3 ease-out duration-200 hover:bg-gray-2"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_98_7461)">
                <mask
                  id="mask0_98_7461"
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                >
                  <path d="M20 0H0V20H20V0Z" fill="white" />
                </mask>
                <g mask="url(#mask0_98_7461)">
                  <path
                    d="M19.999 10.2218C20.0111 9.53429 19.9387 8.84791 19.7834 8.17737H10.2031V11.8884H15.8267C15.7201 12.5391 15.4804 13.162 15.1219 13.7195C14.7634 14.2771 14.2935 14.7578 13.7405 15.1328L13.7209 15.2571L16.7502 17.5568L16.96 17.5774C18.8873 15.8329 19.999 13.2661 19.999 10.2218Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M10.2036 20C12.9586 20 15.2715 19.1111 16.9609 17.5777L13.7409 15.1332C12.8793 15.7223 11.7229 16.1333 10.2036 16.1333C8.91317 16.126 7.65795 15.7206 6.61596 14.9746C5.57397 14.2287 4.79811 13.1802 4.39848 11.9777L4.2789 11.9877L1.12906 14.3766L1.08789 14.4888C1.93622 16.1457 3.23812 17.5386 4.84801 18.512C6.45791 19.4852 8.31194 20.0005 10.2036 20Z"
                    fill="#34A853"
                  />
                  <path
                    d="M4.39899 11.9776C4.1758 11.3411 4.06063 10.673 4.05807 9.9999C4.06218 9.3279 4.1731 8.66067 4.38684 8.02221L4.38115 7.88959L1.1927 5.46234L1.0884 5.51095C0.372762 6.90337 0 8.44075 0 9.99983C0 11.5589 0.372762 13.0962 1.0884 14.4887L4.39899 11.9776Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M10.2039 3.86663C11.6661 3.84438 13.0802 4.37803 14.1495 5.35558L17.0294 2.59997C15.1823 0.90185 12.7364 -0.0298855 10.2039 -3.67839e-05C8.31239 -0.000477835 6.45795 0.514733 4.84805 1.48799C3.23816 2.46123 1.93624 3.85417 1.08789 5.51101L4.38751 8.02225C4.79107 6.82005 5.5695 5.77231 6.61303 5.02675C7.65655 4.28119 8.91254 3.87541 10.2039 3.86663Z"
                    fill="#EB4335"
                  />
                </g>
              </g>
              <defs>
                <clipPath id="clip0_98_7461">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>
            Sign Up with Google
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
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

          <button
            type="submit"
            className="inline-flex font-medium text-white bg-blue py-3 px-10.5 rounded-md ease-out duration-200 hover:bg-blue-dark"
            disabled={loading ? true : false}
          >
            {loading ? "loading...." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
