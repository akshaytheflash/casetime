import snapshot from "../data/njdgSnapshot.json";
import type { Bucket } from "./types";

export interface NjdgSnapshot {
  fetchedAt: string;
  source: string;
  sourceNote: string;
  dataGovNote?: string;
  pendency: Record<Bucket | "total", number>;
  institutedLastMonth: Record<Bucket | "total", number>;
  disposedLastMonth: Record<Bucket | "total", number>;
  disposedContestedLastMonth: Record<Bucket | "total", number>;
  ageBands: { labels: string[]; civil: number[]; criminal: number[]; total: number[] };
}

export const SNAPSHOT = snapshot as unknown as NjdgSnapshot & { preLitigation: number; listedToday: Record<string, number> };

/** Parse the live NJDG HTML dashboard. NJDG serves HTML, not public JSON.
 *  Values are embedded in card markup + fetchYearData('...','a~b~c~d~e') strings.
 *  Returns null on failure so the app can fall back to the dated snapshot. */
export async function fetchLiveNjdg(): Promise<{ snap: NjdgSnapshot; fetchedAt: string } | null> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 15000);
    const res = await fetch("https://njdg.ecourts.gov.in/", {
      headers: { "User-Agent": "Mozilla/5.0 (CaseTime estimator; aggregates only)" },
      signal: ctrl.signal,
    });
    clearTimeout(t);
    if (!res.ok) return null;
    const html = await res.text();
    const num = (label: string) => {
      const i = html.indexOf(label);
      if (i < 0) return null;
      const m = html.slice(i, i + 400).match(/[\d,]{4,}/);
      return m ? parseInt(m[0].replace(/,/g, ""), 10) : null;
    };
    const civil = num("Civil Cases");
    const criminal = num("Criminal Cases");
    const total = num("Total Cases");
    if (civil === null || criminal === null || total === null) return null;
    // Age-band string lives in fetchYearData('lessthan1','4771130~...',...)
    const bandMatch = html.match(/fetchYearData\('[^']*','([\d~]+)'/);
    const bands = bandMatch ? bandMatch[1].split("~").map((s) => parseInt(s, 10)) : null;
    const disposed = (label: string) => {
      const i = html.indexOf(label);
      const m = html.slice(i, i + 600).match(/">(\d+)<\/a>/);
      return m ? parseInt(m[1], 10) : 0;
    };
    return {
      snap: {
        fetchedAt: new Date().toISOString(),
        source: "https://njdg.ecourts.gov.in/",
        sourceNote: "Parsed live from NJDG HTML dashboard.",
        pendency: { civil, criminal, total },
        institutedLastMonth: {
          civil: disposed("Instituted in Last Month") || 0,
          criminal: 0,
          total: disposed("Instituted in Last Month") || 0,
        },
        disposedLastMonth: {
          civil: disposed("Disposed in Last Month") || 0,
          criminal: 0,
          total: disposed("Disposed in Last Month") || 0,
        },
        disposedContestedLastMonth: { civil: 0, criminal: 0, total: 0 },
        ageBands: {
          labels: ["<1 year", "1-3 years", "3-5 years", "5-10 years", ">10 years"],
          civil: bands && bands.length === 5 ? bands : SNAPSHOT.ageBands.civil,
          criminal: SNAPSHOT.ageBands.criminal,
          total: SNAPSHOT.ageBands.total,
        },
      },
      fetchedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

/** Little's Law: full queue clearance (months) if no new cases arrived.
 *  This is a SYSTEM metric, not a single case's disposal time. */
export function queueClearMonths(pendency: number, disposedPerMonth: number): number {
  if (!disposedPerMonth || disposedPerMonth <= 0) return NaN;
  return pendency / disposedPerMonth;
}

/** Pending-pool age percentiles from NJDG age bands.
 *  Midpoints per band: 0.5, 2, 4, 7.5, 12 years (12 = conservative cap for open band).
 *  Returns the age below which P% of the pending pool falls. */
export function pendingPoolPercentiles(bands: number[]): { p50: number; p75: number; p90: number } {
  const midpoints = [0.5, 2, 4, 7.5, 12];
  const total = bands.reduce((a, b) => a + b, 0);
  const cum = bands.map((b, i) => bands.slice(0, i + 1).reduce((a, x) => a + x, 0) / total);
  const at = (p: number) => {
    for (let i = 0; i < cum.length; i++) if (cum[i] >= p) return midpoints[i];
    return 12;
  };
  return { p50: at(0.5), p75: at(0.75), p90: at(0.9) };
}

export function indianFmt(n: number): string {
  return Math.round(n).toLocaleString("en-IN");
}
