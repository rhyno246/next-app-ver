import CheckOutPage from "@/components/Client/CheckOutPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CheckOut Page | NextCommerce Nextjs E-commerce",
  description: "This is CheckOut Page for NextCommerce",
};
export default function CheckOut() {
  return <CheckOutPage />;
}
