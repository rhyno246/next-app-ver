"use client";
import Newsletter from "@/components/Common/Newsletter";
import BestSeller from "./BestSeller";
import Categories from "./Categories";
import CounDown from "./Countdown";
import Hero from "./Hero";
import NewArrival from "./NewArrivals";
import PromoBanner from "./PromoBanner";
import Testimonials from "./Testimonials";
export default function HomePage() {
  return (
    <main>
      <Hero />
      <Categories />
      <NewArrival />
      <PromoBanner />
      <BestSeller />
      <CounDown />
      <Testimonials />
      <Newsletter />
    </main>
  );
}
