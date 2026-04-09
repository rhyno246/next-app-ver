import Products from "@/components/Admin/Products/Products";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Products NextCommerce | NextCommerce Nextjs E-commerce",
  description: "Admin Products NextCommerce Nextjs E-commerce",
};
export default function page() {
  return <Products />;
}
