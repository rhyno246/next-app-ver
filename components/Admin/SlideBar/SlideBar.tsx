"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  Folder,
  LayoutDashboard,
  List,
  ListOrderedIcon,
  NewspaperIcon,
  Notebook,
  Settings,
  Sliders,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const items = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    title: "Products",
    url: "/admin/products",
    icon: <Folder />,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: <User />,
  },
  {
    title: "Slider",
    url: "/admin/sliders",
    icon: <Sliders />,
  },
  {
    title: "Blog",
    url: "/admin/blogs",
    icon: <NewspaperIcon />,
  },
  {
    title: "Orders",
    url: "/admin/orders",
    icon: <ListOrderedIcon />,
  },
  {
    title: "Categories",
    url: "/admin/categories",
    icon: <List />,
  },
  {
    title: "Comment",
    url: "/admin/comments",
    icon: <Notebook />,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: <Settings />,
  },
];

export default function SlideBar() {
  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Link href="/admin/dashboard">
                <Image
                  src="/images/logo/logo.svg"
                  alt="Logo"
                  width={120}
                  height={36}
                  loading="eager"
                  className="w-40 h-auto"
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator className="w-auto!" />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton>
                    <Link href={item.url} className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
