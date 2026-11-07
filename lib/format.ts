const inrFmt = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export function inr(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return `₹${inrFmt.format(Math.round(n))}`;
}

/** Compact Indian money for headlines: ₹4.31 lakh, ₹1.2 crore. */
export function inrShort(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  const v = Math.round(n);
  if (Math.abs(v) >= 10000000) return `₹${(v / 10000000).toFixed(2).replace(/\.00$/, "")} crore`;
  if (Math.abs(v) >= 100000) return `₹${(v / 100000).toFixed(2).replace(/\.00$/, "")} lakh`;
  if (Math.abs(v) >= 1000) return `₹${inrFmt.format(v)}`;
  return `₹${v}`;
}

export function num(n: number): string {
  return inrFmt.format(Math.round(n));
}

export function months(n: number): string {
  if (!Number.isFinite(n)) return "—";
  const m = Math.round(n);
  if (m < 1) return "under a month";
  if (m === 1) return "1 month";
  return `${m} months`;
}

export function yearsMonths(n: number): string {
  if (!Number.isFinite(n)) return "—";
  const total = Math.round(n);
  const y = Math.floor(total / 12);
  const m = total % 12;
  if (y === 0) return months(m);
  if (m === 0) return `${y} ${y === 1 ? "year" : "years"}`;
  return `${y} ${y === 1 ? "year" : "years"} ${m} ${m === 1 ? "month" : "months"}`;
}

export function pct(n: number, digits = 1): string {
  if (!Number.isFinite(n)) return "—";
  return `${(n * 100).toFixed(digits).replace(/\.0$/, "")}%`;
}

export function monthsBetween(fromIso: string, toIso: string): number {
  const a = new Date(fromIso).getTime();
  const b = new Date(toIso).getTime();
  if (!Number.isFinite(a) || !Number.isFinite(b)) return 0;
  return Math.max(0, (b - a) / (1000 * 60 * 60 * 24 * 30.4375));
}
