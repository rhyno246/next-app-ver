import BlogsPage from "@/components/Client/BlogsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blogs Page | NextCommerce Nextjs E-commerce",
  description: "This is Blogs Page for NextCommerce",
};
export default function Blogs() {
  return <BlogsPage />;
}
