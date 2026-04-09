import Footer from "@/components/Admin/Footer/Footer";
import Header from "@/components/Admin/Header/Header";
import SlideBar from "@/components/Admin/SlideBar/SlideBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Metadata } from "next";
import "../../globals.css";
import React from "react";

export const metadata: Metadata = {
  title: "Admin NextCommerce | NextCommerce Nextjs E-commerce",
  description: "Admin NextCommerce Nextjs E-commerce",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-layout flex">
      <TooltipProvider>
        <SidebarProvider>
          <SlideBar />
          <main className="w-full flex flex-col">
            <Header />
            <div className="p-4">{children}</div>
            <Footer />
          </main>
        </SidebarProvider>
      </TooltipProvider>
    </div>
  );
}
