import DashBoardPage from "@/components/Admin/DashBoardPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard NextCommerce | NextCommerce Nextjs E-commerce",
  description: "Admin Dashboard NextCommerce Nextjs E-commerce",
};

export default function index() {
  return <DashBoardPage />;
}
