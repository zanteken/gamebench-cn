import { Requirements } from "@/lib/types";

interface Props {
  minimum: Requirements;
  recommended: Requirements;
}

function ReqRow({
  label,
  minVal,
  recVal,
  suffix,
}: {
  label: string;
  minVal: string | number | null;
  recVal: string | number | null;
  suffix?: string;
}) {
  if (!minVal && !recVal) return null;

  const format = (v: string | number | null) => {
    if (v === null || v === undefined) return "—";
    return suffix ? `${v} ${suffix}` : String(v);
  };

  return (
    <tr className="border-b border-[#1e293b]">
      <td className="py-3 pr-4 text-sm font-medium text-slate-400">{label}</td>
      <td className="py-3 pr-4 text-sm text-slate-200">{format(minVal)}</td>
      <td className="py-3 text-sm text-slate-200">{format(recVal)}</td>
    </tr>
  );
}

export default function RequirementsTable({ minimum, recommended }: Props) {
  const hasAnyData =
    minimum.cpu ||
    minimum.gpu ||
    minimum.ram_gb ||
    recommended.cpu ||
    recommended.gpu ||
    recommended.ram_gb;

  if (!hasAnyData) {
    return (
      <div className="rounded-lg border border-[#1e293b] bg-[#1a2233] p-6 text-center text-sm text-slate-500">
        暂无配置需求数据
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-[#1e293b] bg-[#1a2233]">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#1e293b] bg-[#111827]">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              配置项
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-yellow-500">
              ⚡ 最低配置
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-green-500">
              ✅ 推荐配置
            </th>
          </tr>
        </thead>
        <tbody className="px-4">
          <tr className="border-b border-[#1e293b]">
            <td className="px-4 py-3 text-sm font-medium text-slate-400">
              处理器 (CPU)
            </td>
            <td className="px-4 py-3 text-sm text-slate-200">
              {minimum.cpu || "—"}
            </td>
            <td className="px-4 py-3 text-sm text-slate-200">
              {recommended.cpu || "—"}
            </td>
          </tr>
          <tr className="border-b border-[#1e293b]">
            <td className="px-4 py-3 text-sm font-medium text-slate-400">
              显卡 (GPU)
            </td>
            <td className="px-4 py-3 text-sm text-slate-200">
              {minimum.gpu || "—"}
            </td>
            <td className="px-4 py-3 text-sm text-slate-200">
              {recommended.gpu || "—"}
            </td>
          </tr>
          <tr className="border-b border-[#1e293b]">
            <td className="px-4 py-3 text-sm font-medium text-slate-400">
              内存 (RAM)
            </td>
            <td className="px-4 py-3 text-sm text-slate-200">
              {minimum.ram_gb ? `${minimum.ram_gb} GB` : "—"}
            </td>
            <td className="px-4 py-3 text-sm text-slate-200">
              {recommended.ram_gb ? `${recommended.ram_gb} GB` : "—"}
            </td>
          </tr>
          <tr className="border-b border-[#1e293b]">
            <td className="px-4 py-3 text-sm font-medium text-slate-400">
              存储空间
            </td>
            <td className="px-4 py-3 text-sm text-slate-200">
              {minimum.storage || "—"}
            </td>
            <td className="px-4 py-3 text-sm text-slate-200">
              {recommended.storage || "—"}
            </td>
          </tr>
          <tr>
            <td className="px-4 py-3 text-sm font-medium text-slate-400">
              DirectX
            </td>
            <td className="px-4 py-3 text-sm text-slate-200">
              {minimum.directx || "—"}
            </td>
            <td className="px-4 py-3 text-sm text-slate-200">
              {recommended.directx || "—"}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
