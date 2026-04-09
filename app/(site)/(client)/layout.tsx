import React from "react";
import { Metadata } from "next";
import Header from "@/components/Client/Header/Header";
import Footer from "@/components/Client/Footer/Footer";
import { CartModalProvider } from "@/app/context/CartSidebarModalContext";
import ScrollToTop from "@/components/Common/ScrollToTop";
import CartSidebarModal from "@/components/Common/CartSidebarModal";
import { StoreHydration } from "@/components/Common/StoreHydration";
import { PreviewSliderProvider } from "@/app/context/PreviewSliderContext";
import PreviewSliderModal from "@/components/Common/PreviewSliderModal";
import BrowserTracker from "@/components/Admin/BrowserTracker.";

export const metadata: Metadata = {
  title: "NextCommerce | NextCommerce Nextjs E-commerce",
  description: "NextCommerce Nextjs E-commerce",
};

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="client-layout">
      <CartModalProvider>
        <Header />
        <CartSidebarModal />
      </CartModalProvider>
      <main>
        <PreviewSliderProvider>
          <StoreHydration />
          <BrowserTracker />
          {children}
          <PreviewSliderModal />
        </PreviewSliderProvider>
      </main>
      <ScrollToTop />
      <Footer />
    </div>
  );
}
