import ShopPage from "@/components/Client/ShopPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Page | NextCommerce Nextjs E-commerce",
  description: "This is Shop Page for NextCommerce",
};
export default function Shop() {
  return <ShopPage />;
}
