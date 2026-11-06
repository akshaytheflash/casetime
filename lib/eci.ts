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
