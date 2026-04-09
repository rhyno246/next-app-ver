import ResetPassword from "@/components/Client/Auth/ResetPassword";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password Page | NextCommerce Nextjs E-commerce",
  description: "This is Reset Password Page for NextCommerce",
};

export default function page() {
  return <ResetPassword />;
}
