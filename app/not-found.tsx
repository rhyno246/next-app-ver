import { NotFoundCmt } from "@/components/Client/NotFoundCmt";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Not Found Page | NextCommerce Nextjs",
  description: "This is Not Found Page for NextCommerce",
};
export default function NotFound() {
  return (
    <main>
      <NotFoundCmt />
    </main>
  );
}
