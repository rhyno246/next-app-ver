import { SigninComponent } from "@/components/Client/Auth/SignIn";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Signin Page | NextCommerce Nextjs E-commerce",
  description: "This is Signin Page for NextCommerce",
};
export default function SignIn() {
  return (
    <>
      <SigninComponent />
    </>
  );
}
