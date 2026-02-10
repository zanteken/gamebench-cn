import { Metadata } from "next";
import Link from "next/link";
import { getDictionary, type Locale } from "@/i18n/dictionaries";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);

  return {
    title: locale === "zh"
      ? "下载 GameBencher 桌面端 - PC游戏性能检测工具"
      : "Download GameBencher Desktop - PC Game Performance Tool",
    description: locale === "zh"
      ? "免费下载 GameBencher 桌面端，自动检测硬件配置，实时监测游戏帧率，一键生成性能报告。支持 Windows 和 macOS。"
      : "Free download GameBencher Desktop. Auto-detect hardware, monitor game FPS, generate performance reports. Supports Windows and macOS.",
    keywords: locale === "zh"
      ? "游戏性能检测,FPS监测,硬件检测,GameBench下载,PC性能工具"
      : "game performance,FPS monitor,hardware detection,GameBench download,PC benchmark",
  };
}

// 版本信息 — 更新发布时修改这里
const CURRENT_VERSION = "0.1.0";
const RELEASE_DATE = "2026-02";
const DOWNLOADS = {
  windows: {
    url: "/downloads/GameBencher-0.1.0-win64.exe",
    size: "~6 MB",
    label: "Windows 安装包",
    fileName: "GameBencher-0.1.0-win64.exe",
    requirements: "Windows 10/11 64-bit · WebView2 运行时",
    available: true,
  },
  mac: {
    url: "#",
    size: "开发中",
    label: "macOS 安装包",
    fileName: "GameBencher-0.1.0-macos.dmg",
    requirements: "macOS 12+ · Apple Silicon / Intel",
    available: false,
  },
};

export default function DownloadPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const isZh = locale === "zh";

  return (
    <main className="min-h-screen bg-[#0a0f1a]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-600/8 rounded-full blur-[120px]" />
          <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px]" />
          {/* 网格线 */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
          {/* 版本标签 */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            v{CURRENT_VERSION} · {RELEASE_DATE}
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            GameBencher
            <span className="block text-2xl sm:text-3xl font-normal text-slate-400 mt-2">
              {isZh ? "PC 游戏性能检测工具" : "PC Game Performance Tool"}
            </span>
          </h1>

          <p className="text-slate-400 max-w-xl mx-auto mb-12 leading-relaxed">
            {isZh ? (
              <>
                自动检测硬件配置，实时监测游戏帧率，生成详细性能报告。
                <br />
                基于 Intel PresentMon 引擎，开源免费，无广告。
              </>
            ) : (
              <>
                Auto-detect hardware specs, monitor game FPS in real-time, generate detailed performance reports.
                <br />
                Powered by Intel PresentMon, open source & free, no ads.
              </>
            )}
          </p>

          {/* 下载按钮 */}
          <DownloadButtons isZh={isZh} />

          {/* 附加信息 */}
          <div className="flex items-center justify-center gap-6 mt-8 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldIcon />
              {isZh ? "开源免费" : "Open Source"}
            </span>
            <span className="flex items-center gap-1.5">
              <LockIcon />
              {isZh ? "无广告 · 无追踪" : "No Ads · No Tracking"}
            </span>
            <span className="flex items-center gap-1.5">
              <GithubIcon />
              <a
                href="https://github.com/zanteken/gamebench-cn"
                target="_blank"
                rel="noopener"
                className="hover:text-white transition-colors"
              >
                {isZh ? "GitHub 源码" : "GitHub Source"}
              </a>
            </span>
          </div>
        </div>
      </section>

      {/* 功能展示 */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-5">
          <FeatureCard
            icon={<CpuIcon />}
            title={isZh ? "硬件自动检测" : "Hardware Detection"}
            description={isZh
              ? "一键识别 CPU、GPU、内存型号与参数，涵盖主流硬件的性能评分数据库。"
              : "One-click detect CPU, GPU, RAM specs. Auto-match with comprehensive hardware performance database."}
            color="blue"
          />
          <FeatureCard
            icon={<GaugeIcon />}
            title={isZh ? "FPS 实时监测" : "Real-time FPS Monitor"}
            description={isZh
              ? "集成 Intel PresentMon 引擎，实时显示 FPS、1% Low、0.1% Low 和帧时间曲线，不影响游戏性能。"
              : "Integrated Intel PresentMon engine. Show FPS, 1% Low, 0.1% Low and frame time graphs in real-time without affecting game performance."}
            color="cyan"
            badge="Windows"
          />
          <FeatureCard
            icon={<UploadIcon />}
            title={isZh ? "社区数据共享" : "Community Data Sharing"}
            description={isZh
              ? "匿名上传性能数据，帮助其他玩家参考。基于真实数据的 FPS 预测，不再靠猜。"
              : "Anonymously upload performance data to help other players. FPS predictions based on real data, no more guessing."}
            color="emerald"
          />
        </div>
      </section>

      {/* 平台对比 */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-xl font-bold text-white text-center mb-8">
          {isZh ? "平台功能对比" : "Platform Comparison"}
        </h2>
        <div className="overflow-hidden rounded-xl border border-slate-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-800/50">
                <th className="text-left px-5 py-3 text-slate-400 font-medium">
                  {isZh ? "功能" : "Feature"}
                </th>
                <th className="text-center px-5 py-3 text-slate-400 font-medium">
                  <span className="inline-flex items-center gap-1.5">
                    <WindowsIcon /> Windows
                  </span>
                </th>
                <th className="text-center px-5 py-3 text-slate-400 font-medium">
                  <span className="inline-flex items-center gap-1.5">
                    <AppleIcon /> macOS
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              <CompareRow feature={isZh ? "CPU / GPU / RAM 检测" : "CPU / GPU / RAM Detection"} win={true} mac={true} />
              <CompareRow feature={isZh ? "自动匹配硬件数据库" : "Auto-match Hardware Database"} win={true} mac={true} />
              <CompareRow feature={isZh ? "游戏进程自动识别" : "Auto Game Process Detection"} win={true} mac={true} />
              <CompareRow feature={isZh ? "FPS 实时监测 (PresentMon)" : "Real-time FPS (PresentMon)"} win={true} mac={false} note={isZh ? "macOS 暂不支持" : "macOS coming soon"} />
              <CompareRow feature={isZh ? "FPS 帧时间曲线" : "FPS Frame Time Graph"} win={true} mac={false} />
              <CompareRow feature={isZh ? "Metal HUD 引导" : "Metal HUD Guide"} win={false} mac={true} />
              <CompareRow feature={isZh ? "性能数据上传" : "Performance Data Upload"} win={true} mac={true} />
              <CompareRow feature={isZh ? "系统托盘常驻" : "System Tray Resident"} win={true} mac={true} />
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-600 text-center mt-3">
          {isZh
            ? "macOS 版 FPS 监测功能将在后续版本通过 IOKit GPU 计数器实现"
            : "macOS FPS monitoring will be implemented in future versions via IOKit GPU counters"}
        </p>
      </section>

      {/* 系统要求 */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-xl font-bold text-white text-center mb-8">
          {isZh ? "系统要求" : "System Requirements"}
        </h2>
        <div className="grid md:grid-cols-2 gap-5">
          <RequirementCard
            platform="Windows"
            icon={<WindowsIcon />}
            items={[
              isZh ? "Windows 10 (1809+) 或 Windows 11" : "Windows 10 (1809+) or Windows 11",
              isZh ? "64 位系统" : "64-bit system",
              isZh ? "WebView2 运行时（Win11 已内置）" : "WebView2 Runtime (built-in on Win11)",
              isZh ? "管理员权限（FPS 监测需要 ETW）" : "Admin rights (FPS monitoring needs ETW)",
              isZh ? "约 30MB 磁盘空间" : "~30MB disk space",
            ]}
          />
          <RequirementCard
            platform="macOS"
            icon={<AppleIcon />}
            items={[
              isZh ? "macOS 12 Monterey 或更高" : "macOS 12 Monterey or later",
              isZh ? "Apple Silicon (M1/M2/M3) 或 Intel" : "Apple Silicon (M1/M2/M3) or Intel",
              isZh ? "约 40MB 磁盘空间" : "~40MB disk space",
              isZh ? "无需额外运行时" : "No additional runtime required",
            ]}
          />
        </div>
      </section>

      {/* 安装步骤 */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <h2 className="text-xl font-bold text-white text-center mb-8">
          {isZh ? "安装只需 3 步" : "3 Steps to Install"}
        </h2>
        <div className="space-y-4">
          <Step
            num={1}
            title={isZh ? "下载安装包" : "Download Installer"}
            desc={isZh ? "点击上方按钮下载对应平台的安装包" : "Click the button above to download the installer for your platform"}
          />
          <Step
            num={2}
            title={isZh ? "运行安装" : "Run Installer"}
            desc={isZh ? "Windows: 双击 .exe 安装；macOS: 打开 .dmg 拖入应用程序文件夹" : "Windows: Double-click .exe; macOS: Open .dmg and drag to Applications folder"}
          />
          <Step
            num={3}
            title={isZh ? "启动检测" : "Start Monitoring"}
            desc={isZh ? "以管理员权限运行（Windows），打开软件即自动检测硬件，启动游戏后自动提示 FPS 监测" : "Run as admin (Windows), the app auto-detects hardware and prompts FPS monitoring when you launch a game"}
          />
        </div>
      </section>

      {/* 底部 CTA */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-600/10 to-cyan-600/5 border border-blue-500/10">
          <h3 className="text-xl font-bold text-white mb-2">
            {isZh ? "准备好了吗？" : "Ready to Go?"}
          </h3>
          <p className="text-slate-400 text-sm mb-6">
            {isZh ? "下载 GameBencher，用数据说话。" : "Download GameBencher and let the data speak."}
          </p>
          <DownloadButtons isZh={isZh} compact />
        </div>
      </section>
    </main>
  );
}

// ==================== 子组件 ====================

function DownloadButtons({ isZh = true, compact = false }: { isZh?: boolean; compact?: boolean }) {
  return (
    <div className={`flex flex-col sm:flex-row items-center justify-center ${compact ? "gap-3" : "gap-4"}`}>
      <a
        href={DOWNLOADS.windows.url}
        download={DOWNLOADS.windows.fileName}
        className={`group flex items-center gap-3 px-6 ${
          compact ? "py-2.5" : "py-3.5"
        } rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all hover:shadow-lg hover:shadow-blue-600/20`}
      >
        <WindowsIcon />
        <div className="text-left">
          <div className={compact ? "text-sm" : "text-base"}>
            {isZh ? "下载 Windows 版" : "Download for Windows"}
          </div>
          {!compact && (
            <div className="text-xs text-blue-200/70">{DOWNLOADS.windows.size} · {DOWNLOADS.windows.requirements}</div>
          )}
        </div>
        <DownloadArrow />
      </a>
      <div
        className={`group flex items-center gap-3 px-6 ${
          compact ? "py-2.5" : "py-3.5"
        } rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-500 cursor-not-allowed`}
      >
        <AppleIcon />
        <div className="text-left">
          <div className={compact ? "text-sm" : "text-base"}>
            {isZh ? "macOS 版开发中" : "macOS Coming Soon"}
          </div>
          {!compact && (
            <div className="text-xs text-slate-600">{isZh ? "敬请期待" : "Stay tuned"}</div>
          )}
        </div>
        <span className="ml-1 px-2 py-0.5 rounded text-[10px] bg-slate-700/50 text-slate-500">
          {isZh ? "开发中" : "WIP"}
        </span>
      </div>
    </div>
  );
}

function FeatureCard({
  icon, title, description, color, badge,
}: {
  icon: React.ReactNode; title: string; description: string; color: string; badge?: string;
}) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/10",
    cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/10",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/10",
  };
  const iconColorMap: Record<string, string> = {
    blue: "bg-blue-500/10 text-blue-400",
    cyan: "bg-cyan-500/10 text-cyan-400",
    emerald: "bg-emerald-500/10 text-emerald-400",
  };

  return (
    <div className={`p-6 rounded-xl border ${colorMap[color]} backdrop-blur-sm`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-lg ${iconColorMap[color]}`}>{icon}</div>
        {badge && (
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-700 text-slate-300">
            {badge}
          </span>
        )}
      </div>
      <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}

function CompareRow({
  feature, win, mac, note,
}: {
  feature: string; win: boolean; mac: boolean; note?: string;
}) {
  return (
    <tr className="hover:bg-slate-800/30 transition-colors">
      <td className="px-5 py-3 text-slate-300">{feature}</td>
      <td className="text-center px-5 py-3">
        {win ? <CheckMark /> : <CrossMark />}
      </td>
      <td className="text-center px-5 py-3">
        {mac ? (
          <CheckMark />
        ) : note ? (
          <span className="text-xs text-slate-600">{note}</span>
        ) : (
          <CrossMark />
        )}
      </td>
    </tr>
  );
}

function RequirementCard({
  platform, icon, items,
}: {
  platform: string; icon: React.ReactNode; items: string[];
}) {
  return (
    <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <span className="text-sm font-semibold text-white">{platform}</span>
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
            <span className="text-slate-600 mt-1">•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Step({ num, title, desc }: { num: number; title: string; desc: string }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center text-sm font-bold">
        {num}
      </div>
      <div>
        <div className="text-sm font-semibold text-white">{title}</div>
        <div className="text-sm text-slate-400 mt-0.5">{desc}</div>
      </div>
    </div>
  );
}

// ==================== SVG Icons ====================

function WindowsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M0 2.3l6.5-.9v6.3H0V2.3zm7.3-1l8.7-1.3v7.6H7.3V1.3zM16 8.4v7.5l-8.7-1.2V8.4H16zM6.5 14.5L0 13.7V8.4h6.5v6.1z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="14" height="16" viewBox="0 0 14 17" fill="currentColor">
      <path d="M13.3 13.2c-.5 1.1-.7 1.6-1.3 2.5-.9 1.3-2.1 2.9-3.6 2.9-1.4 0-1.7-.9-3.5-.9s-2.2.9-3.5.9C.1 18.7-.9 17.3-1.8 16c-2.5-3.6-2.7-7.8-1.2-10 1.1-1.6 2.8-2.5 4.3-2.5 1.6 0 2.6 1 3.5 1s2.2-1.1 3.7-1c.9 0 2.8.4 3.8 2.5-3 1.7-2.5 5.9.5 7.2zM9.2 1.7C9.9.8 10.4-.3 10.2-1.5c-1 .1-2.2.7-2.9 1.6C6.6.9 6 2.1 6.2 3.2c1.1 0 2.3-.6 3-1.5z"
        transform="translate(1.5, 1.5)" />
    </svg>
  );
}

function DownloadArrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-50 group-hover:opacity-100 group-hover:translate-y-0.5 transition-all">
      <path d="M8 2v10M4 8l4 4 4-4" />
    </svg>
  );
}

function CheckMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" className="inline-block text-emerald-500">
      <circle cx="9" cy="9" r="8" fill="currentColor" opacity="0.15" />
      <path d="M5.5 9.5l2 2 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CrossMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" className="inline-block text-slate-600">
      <circle cx="9" cy="9" r="8" fill="currentColor" opacity="0.15" />
      <path d="M6.5 6.5l5 5M11.5 6.5l-5 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function CpuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" rx="1" />
      <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3" />
    </svg>
  );
}

function GaugeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
      <path d="M12 6v6l4 2" />
      <path d="M16.24 7.76l-1.42 1.42" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}
