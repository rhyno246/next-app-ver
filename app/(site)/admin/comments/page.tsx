import CommentsPage from "@/components/Admin/Comments";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Comments NextCommerce | NextCommerce Nextjs E-commerce",
  description: "Admin Comments NextCommerce Nextjs E-commerce",
};

export default function Comments() {
  return <CommentsPage />;
}
