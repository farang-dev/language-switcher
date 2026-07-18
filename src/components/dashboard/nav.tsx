"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/sites", label: "Sites" },
  { href: "/dashboard/insights", label: "Insights" },
  { href: "/dashboard/settings", label: "Settings" },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-1">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors",
            pathname === item.href
              ? "bg-[#e6f7f1] text-[#00a67e]"
              : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
