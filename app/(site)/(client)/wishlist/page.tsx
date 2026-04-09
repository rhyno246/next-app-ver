import WishListPage from "@/components/Client/WishListPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "WishList Page | NextCommerce Nextjs E-commerce",
  description: "This is WishList Page for NextCommerce",
};
export default function WishList() {
  return <WishListPage />;
}
