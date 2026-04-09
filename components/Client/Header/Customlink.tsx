"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

// ===== TYPES =====
export interface MenuItem {
  label: string;
  href: string;
  children?: MenuItem[];
}

interface CustomLinkProps {
  item: MenuItem;
  depth?: number;
  stickyMenu?: boolean;
}

interface NavMenuProps {
  items: MenuItem[];
  stickyMenu?: boolean;
}

// ===== HELPER: kiểm tra link có active không =====
function useIsActive(href: string, children?: MenuItem[]): boolean {
  const pathname = usePathname();

  // Chính nó active
  if (pathname === href) return true;

  // Active nếu 1 trong các children active
  if (children?.length) {
    return children.some(
      (child) =>
        pathname === child.href ||
        child.children?.some((grandchild) => pathname === grandchild.href),
    );
  }

  return false;
}

// ===== COMPONENT: Single Link Item =====
export function CustomLink({ item, depth = 0, stickyMenu }: CustomLinkProps) {
  const { label, href, children } = item;
  const pathname = usePathname();
  const isActive = useIsActive(href, children);
  const hasChildren = children && children.length > 0;

  const hasActiveChild = hasChildren
    ? children.some(
        (child) =>
          pathname === child.href ||
          child.children?.some((g) => pathname === g.href),
      )
    : false;

  const [isOpen, setIsOpen] = useState(() => hasActiveChild);
  const menuRef = useRef<HTMLDivElement>(null);

  // Sync isOpen khi pathname thay đổi
  useEffect(() => {
    if (hasActiveChild) setIsOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Đóng khi click ra ngoài (chỉ cho top-level)
  useEffect(() => {
    if (depth > 0) return;
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [depth]);

  // ---- Render: có children ----
  if (hasChildren) {
    return (
      <div ref={menuRef} className="relative">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className={[
            "flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 w-full",
            depth === 0
              ? isActive
                ? "text-blue bg-blue-light-5 font-semibold"
                : "text-dark-3 hover:text-blue hover:bg-gray-1"
              : isActive
                ? "text-blue bg-blue-light-5 font-semibold"
                : "text-dark-3 hover:text-blue hover:bg-gray-1",
          ].join(" ")}
          aria-expanded={isOpen}
        >
          <span className="flex-1 text-left">{label}</span>

          {/* Active dot */}
          {isActive && depth > 0 && (
            <span className="w-1.5 h-1.5 rounded-full bg-blue shrink-0" />
          )}

          {/* Chevron */}
          <svg
            className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Dropdown children */}
        <div
          className={[
            "overflow-hidden transition-all duration-200",
            depth === 0
              ? "absolute top-full left-0 mt-1 min-w-45 bg-white border border-gray-3 rounded-lg shadow-2 z-999 py-1"
              : "pl-3 border-l border-gray-3 ml-3 mt-0.5",
            isOpen ? "block opacity-100" : "hidden opacity-0",
          ].join(" ")}
        >
          {children.map((child) => (
            <CustomLink
              key={child.href}
              item={child}
              depth={depth + 1}
              stickyMenu={stickyMenu}
            />
          ))}
        </div>
      </div>
    );
  }

  // ---- Render: link thường ----
  return (
    <li className="group relative before:w-0 before:h-0.75 before:bg-blue before:absolute before:left-0 before:top-0 before:rounded-b-[3px] before:ease-out before:duration-200 hover:before:w-full ">
      <Link
        href={href}
        className={[
          "flex items-center gap-2 text-custom-sm font-medium transition-all duration-200",
          // Padding: top-level dùng stickyMenu, nested dùng px/py cố định
          depth === 0 ? (stickyMenu ? "xl:py-4" : "xl:py-6") : "px-4 py-2",
          // Active / hover styles
          depth === 0
            ? isActive
              ? "text-blue font-semibold"
              : "text-dark hover:text-blue"
            : isActive
              ? "text-blue bg-blue-light-5 font-semibold rounded-md"
              : "text-dark-3 hover:text-blue hover:bg-gray-1 rounded-md",
        ].join(" ")}
      >
        {/* Active indicator cho nested */}
        {depth > 0 && (
          <span
            className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-200 ${
              isActive ? "bg-blue" : "bg-gray-4"
            }`}
          />
        )}
        <span>{label}</span>
      </Link>
    </li>
  );
}
