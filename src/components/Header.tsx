import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#1e293b] bg-[#0a0e17]/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
            GB
          </div>
          <span className="text-lg font-bold text-white">
            GameBench <span className="text-brand-400">CN</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className="text-sm text-slate-400 transition hover:text-white"
          >
            游戏库
          </Link>
          <Link
            href="/fps-calculator"
            className="text-sm text-slate-400 transition hover:text-white"
          >
            FPS 计算器
          </Link>
          <span className="text-sm text-slate-600 cursor-default">
            CPU 榜单
            <span className="ml-1 rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-500">
              即将推出
            </span>
          </span>
          <span className="text-sm text-slate-600 cursor-default">
            GPU 榜单
            <span className="ml-1 rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-500">
              即将推出
            </span>
          </span>
        </nav>

        {/* Search (placeholder) */}
        <div className="hidden md:block">
          <div className="flex h-9 w-64 items-center rounded-lg border border-[#1e293b] bg-[#111827] px-3">
            <svg
              className="mr-2 h-4 w-4 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span className="text-sm text-slate-500">搜索游戏或硬件...</span>
          </div>
        </div>
      </div>
    </header>
  );
}
