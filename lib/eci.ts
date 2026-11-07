// eCourtsIndia partner API — THIRD-PARTY (not a government service), paid plan, key-gated.
// Docs per brief: GET /api/partner/v2/search, GET /api/partner/case/{cnr}
// Rules: retry on 429/5xx (never on 400); never scrape services.ecourts.gov.in.
// CNRs come only from search results — the app never invents them.
const BASE = process.env.ECI_BASE_URL || "https://webapi.ecourtsindia.com";

export function eciConfigured(): boolean {
  return Boolean(process.env.ECI_KEY);
}

async function eciFetch(path: string): Promise<{ status: number; body: unknown }> {
  const key = process.env.ECI_KEY || "";
  const delays = [0, 1000, 2000, 4000];
  let last = { status: 0, body: null as unknown };
  for (let attempt = 0; attempt < delays.length; attempt++) {
    if (delays[attempt]) await new Promise((r) => setTimeout(r, delays[attempt]));
    try {
      const res = await fetch(`${BASE}${path}`, {
        headers: { Authorization: `Bearer ${key}` },
      });
      const body = await res.json().catch(() => null);
      last = { status: res.status, body };
      const retryable = res.status === 429 || (res.status >= 500 && res.status <= 599);
      if (!retryable) return last; // never retry 400 (or any 4xx)
    } catch (err) {
      last = { status: 0, body: { error: String(err) } };
    }
  }
  return last;
}

export async function eciSearch(query: string) {
  return eciFetch(`/api/partner/v2/search?query=${encodeURIComponent(query)}`);
}

export async function eciCase(cnr: string) {
  return eciFetch(`/api/partner/case/${encodeURIComponent(cnr)}`);
}

export interface EciCohort {
  n: number;
  medianMonths: number;
  p75Months: number;
  source: string;
  fetchedAt: string;
}

function asTime(v: unknown): number | null {
  if (typeof v !== "string" && typeof v !== "number") return null;
  const t = new Date(v).getTime();
  return Number.isFinite(t) ? t : null;
}

function pick(row: Record<string, unknown>, keys: string[]): unknown {
  for (const k of keys) {
    if (row[k] !== undefined && row[k] !== null) return row[k];
  }
  return null;
}

/**
 * Optional cohort mode. Only runs when ECI_KEY is present. It asks the partner
 * search endpoint for disposed cases and computes filing→decision durations
 * from fields the response actually contains. If the response shape does not
 * contain dated disposed rows, it returns null and the app falls back to the
 * labelled queue-based lower bound. It never fills a missing date.
 */
export async function eciDisposedCohort(query: string): Promise<EciCohort | null> {
  if (!eciConfigured()) return null;
  const r = await eciSearch(query);
  if (r.status !== 200) return null;
  const body = r.body as Record<string, unknown> | null;
  if (!body) return null;
  const raw = body.results ?? body.cases ?? body.data;
  if (!Array.isArray(raw)) return null;
  const durations: number[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    const filing = asTime(
      pick(row, ["filing_date", "filingDate", "date_of_filing", "institution_date", "institutionDate"])
    );
    const decision = asTime(
      pick(row, ["decision_date", "decisionDate", "disposal_date", "disposalDate", "date_of_decision"])
    );
    if (filing !== null && decision !== null && decision > filing) {
      durations.push((decision - filing) / (1000 * 60 * 60 * 24 * 30.4375));
    }
  }
  if (durations.length < 5) return null;
  durations.sort((a, b) => a - b);
  const at = (p: number) => durations[Math.min(durations.length - 1, Math.floor(p * durations.length))];
  return {
    n: durations.length,
    medianMonths: at(0.5),
    p75Months: at(0.75),
    source: "eCourtsIndia partner API (third-party, key-gated)",
    fetchedAt: new Date().toISOString(),
  };
}

export function cohortQuery(state: string, caseType: string): string {
  return `${caseType} ${state} disposed`;
}
