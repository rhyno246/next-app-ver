import Settings from "@/components/Admin/Settings/Settings";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Setting NextCommerce | NextCommerce Nextjs E-commerce",
  description: "Admin Setting NextCommerce Nextjs E-commerce",
};
export default function page() {
  return <Settings />;
}
