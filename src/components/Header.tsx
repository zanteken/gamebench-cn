"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "游戏库" },
  { href: "/fps-calculator", label: "FPS计算器" },
  { href: "/gpu", label: "显卡天梯" },
  { href: "/cpu", label: "CPU天梯" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[#1e293b] bg-[#0a0e17]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold text-white tracking-tight">
          Game<span className="text-blue-500">Bencher</span>
        </Link>
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-1.5 text-sm transition ${
                  active
                    ? "bg-blue-600/20 text-blue-400 font-medium"
                    : "text-slate-400 hover:text-white hover:bg-[#1a2233]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
