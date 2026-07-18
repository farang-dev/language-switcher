"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function DashboardNav({ dict }: { dict: any }) {
  const pathname = usePathname();
  const d = dict.dashboard.nav;

  const navItems = [
    { href: "/dashboard", label: d.overview },
    { href: "/dashboard/sites", label: d.sites },
    { href: "/dashboard/insights", label: d.insights },
    { href: "/dashboard/settings", label: d.settings },
  ];

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
