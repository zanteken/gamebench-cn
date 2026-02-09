import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 text-6xl">🎮</div>
      <h1 className="mb-2 text-2xl font-bold text-white">页面未找到</h1>
      <p className="mb-6 text-slate-400">
        这个游戏页面不存在，或者已经被移除了
      </p>
      <Link
        href="/"
        className="rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700"
      >
        返回游戏库
      </Link>
    </div>
  );
}
