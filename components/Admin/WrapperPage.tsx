"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

type BreadcrumbItemType = {
  label: string;
  href?: string;
};

type Props = {
  title: string;
  breadcrumbs: BreadcrumbItemType[];
  children: React.ReactNode;
};

export default function WrapperPage({ title, breadcrumbs, children }: Props) {
  return (
    <>
      <h1 className="text-2xl uppercase font-bold mb-4">{title}</h1>
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {item.href ? (
                  <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-4">{children}</div>
    </>
  );
}
