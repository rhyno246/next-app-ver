import OrdersPage from "@/components/Admin/OrdersPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Orders NextCommerce | NextCommerce Nextjs E-commerce",
  description: "Admin Orders NextCommerce Nextjs E-commerce",
};

export default function Orders() {
  return <OrdersPage />;
}
