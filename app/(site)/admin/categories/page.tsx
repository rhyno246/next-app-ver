import Categories from "@/components/Admin/Categories/Categories";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Admin Categories NextCommerce | NextCommerce Nextjs E-commerce",
  description: "Admin Categories NextCommerce Nextjs E-commerce",
};
export default function page() {
  return <Categories />;
}
