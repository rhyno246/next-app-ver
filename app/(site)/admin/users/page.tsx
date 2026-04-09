import Users from "@/components/Admin/Users/Users";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Users NextCommerce | NextCommerce Nextjs E-commerce",
  description: "Admin Users NextCommerce Nextjs E-commerce",
};

export default function page() {
  return <Users />;
}
