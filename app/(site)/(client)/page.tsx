import HomePage from "@/components/Client/HomePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home Page | NextCommerce Nextjs E-commerce",
  description: "This is Home Page for NextCommerce",
};
export default function Home() {
  return <HomePage />;
}
