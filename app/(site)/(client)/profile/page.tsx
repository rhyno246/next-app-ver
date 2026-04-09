import ProfilePage from "@/components/Client/ProfilePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile Page | NextCommerce Nextjs E-commerce",
  description: "This is Profile Page for NextCommerce",
};

export default function page() {
  return <ProfilePage />;
}
