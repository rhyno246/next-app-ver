import Blogs from "@/components/Admin/Blogs/Blogs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Blogs NextCommerce | NextCommerce Nextjs E-commerce",
  description: "Admin Blogs NextCommerce Nextjs E-commerce",
};

export default function page() {
  return <Blogs />;
}
