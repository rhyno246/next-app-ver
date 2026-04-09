import { SignUpComponent } from "@/components/Client/Auth/SignUp";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SignUp Page | NextCommerce Nextjs E-commerce",
  description: "This is SignUp Page for NextCommerce",
};
export default function SignUp() {
  return <SignUpComponent />;
}
