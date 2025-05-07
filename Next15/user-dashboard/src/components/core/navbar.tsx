"use client";

import Dashboard from "@/icons/dashboard";
import Department from "@/icons/department";
import User from "@/icons/user";

import { IconProps } from "@/types/core";
import { User as UserType } from "@/types/user";
import Link from "next/link";
import { usePathname } from "next/navigation";
export interface MenuItem {
  icon: React.ComponentType<IconProps>;
  label: string;
  href: string;
  path: string[];
}

export const menuItems: MenuItem[] = [
  {
    label: "Users",
    icon: User,
    href: "/users",
    path: ["users"],
  },
  {
    label: "Dashboards",
    icon: Dashboard,
    href: "/dashboards",
    path: ["dashboards"],
  },
  {
    label: "Departments",
    icon: Department,
    href: "/departments",
    path: ["departments", "department"],
  },
];
export default function Navbar({ user }: { user: UserType }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-5 overflow-y-auto py-5">
      {menuItems.map((item) => {
        // For company-user, only render dashboard item
        if (user.role === "company-user" && !item.href.includes("dashboard")) {
          return null;
        }

        // For admin roles, render all menu items
        if (
          user.role === "company-admin" ||
          (user.role === "company-user" && item.href.includes("dashboard"))
        ) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center px-2 hover:text-primary transition-colors ${
                item.path.some((p) => pathname.includes(p))
                  ? "text-primary"
                  : "text-gray-500"
              }`}
            >
              <item.icon fill="currentColor" />
              <span className="text-xs mt-1 font-semibold">{item.label}</span>
            </Link>
          );
        }
        return null;
      })}
    </nav>
  );
}
