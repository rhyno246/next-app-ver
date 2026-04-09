import SearchPage from "@/components/Client/Search";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Page | NextCommerce Nextjs E-commerce",
  description: "This is Search Page for NextCommerce",
};

export default function page() {
  return <SearchPage />;
}
