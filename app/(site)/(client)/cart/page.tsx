import CartPage from "@/components/Client/CartPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart Page | NextCommerce Nextjs E-commerce",
  description: "This is Cart Page for NextCommerce",
};
export default function page() {
  return <CartPage />;
}
