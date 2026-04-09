"use client";
import { useForm } from "react-hook-form";
import { ChangePasswordSchema } from "@/schema/changePasswordSchema";
import { providerConfig } from "@/Enum/enum";
import CustomInput from "@/components/Common/CustomInput";
import { Author, UpdateAuthor } from "@/types/type";
import { useMutation } from "@apollo/client/react";
import { UPDATE_CLIENT_AUTHOR } from "@/graphql/mutations";
import { Toast } from "@/utils/toast";

export default function PasswordForm({ user }: { user: Author }) {
  const isOAuth = user.provider !== providerConfig.local_provider;
  const { control, handleSubmit, reset } = useForm<ChangePasswordSchema>({
    resolver: async (data) => {
      const errors: Record<string, { message: string }> = {};

      if (!isOAuth) {
        if (!data.password) {
          errors.password = { message: "Old password is required" };
        } else if (data.password.length < 6) {
          errors.password = {
            message: "Password must be at least 6 characters",
          };
        }
      }

      if (!data.newpassword) {
        errors.newpassword = { message: "New password is required" };
      } else if (data.newpassword.length < 6) {
        errors.newpassword = {
          message: "New password must be at least 6 characters",
        };
      }

      if (!data.cfnewpassword) {
        errors.cfnewpassword = { message: "Confirm password is required" };
      } else if (data.cfnewpassword.length < 6) {
        errors.cfnewpassword = {
          message: "Confirm password must be at least 6 characters",
        };
      } else if (data.newpassword !== data.cfnewpassword) {
        errors.cfnewpassword = { message: "Passwords do not match" };
      }

      return {
        values: Object.keys(errors).length === 0 ? data : {},
        errors,
      };
    },
    defaultValues: {
      password: "",
      newpassword: "",
      cfnewpassword: "",
    },
  });

  const [updateAuthor, { loading }] = useMutation<UpdateAuthor>(
    UPDATE_CLIENT_AUTHOR,
    {
      onCompleted: (data) => {
        if (data) {
          Toast.success("Upadte info success");
          reset();
        }
      },
      onError: (error) => {
        Toast.error(error.message);
      },
    },
  );

  const onSubmit = (data: ChangePasswordSchema) => {
    updateAuthor({
      variables: {
        data: {
          id: user?.id,
          password: data.newpassword,
          oldPassword: data.password,
        },
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {!isOAuth && (
        <div className="w-full">
          <CustomInput
            type="password"
            control={control}
            name="password"
            label="Old Password"
            placeholder="type Old Password"
          />
        </div>
      )}
      <div className="w-full">
        <CustomInput
          type="password"
          control={control}
          name="newpassword"
          label="New Password"
          placeholder="type New Password"
        />
      </div>
      <div className="w-full">
        <CustomInput
          type="password"
          control={control}
          name="cfnewpassword"
          label="Confirm New Password"
          placeholder="type Confirm New Password"
        />
      </div>
      <button
        type="submit"
        className="inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark"
        disabled={loading ? true : false}
      >
        {loading ? "loading..." : "Change Password"}
      </button>
    </form>
  );
}
