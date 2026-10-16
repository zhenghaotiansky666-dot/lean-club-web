/** 分 → ¥ 展示（9.90 / 100.00） */
export function formatCents(cents: number): string {
  return `¥${(cents / 100).toFixed(2)}`;
}

/** 分 → 简洁展示（¥9.9 / ¥100） */
export function formatCentsCompact(cents: number): string {
  const yuan = cents / 100;
  return `¥${Number.isInteger(yuan) ? yuan : yuan.toFixed(1)}`;
}

export function formatDateCN(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

export function formatDateTimeCN(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getMonth() + 1}月${d.getDate()}日 ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

/** 取名字首字（中英文都能用） */
export function initials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "LC";
  if (/^[\u4e00-\u9fa5]/.test(trimmed)) return trimmed.slice(0, 2);
  const parts = trimmed.split(/\s+/);
  if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
  return trimmed.slice(0, 2).toUpperCase();
}

/** 由字符串稳定派生渐变色（用于头像占位） */
export function gradientFor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 360;
  const h2 = (h + 42) % 360;
  return `linear-gradient(135deg, hsl(${h} 70% 34%), hsl(${h2} 65% 18%))`;
}
