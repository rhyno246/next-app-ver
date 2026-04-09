import ForgetPassword from "@/components/Client/Auth/ForgetPassword";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forget Password Page | NextCommerce Nextjs E-commerce",
  description: "This is Forget Password Page for NextCommerce",
};
export default function page() {
  return <ForgetPassword />;
}
