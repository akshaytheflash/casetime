import { fetchLiveNjdg, SNAPSHOT } from "../../../lib/njdg";
import { cacheNjdg, readNjdgCache } from "../../../lib/db";

export const dynamic = "force-dynamic";

// Live NJDG aggregates (HTML parsed server-side). Falls back to dated snapshot.
// Cache for 1 hour in SQLite so the estimator never fails when NJDG is down.
export async function GET() {
  const cached = readNjdgCacheSafe();
  if (cached && Date.now() - new Date(cached.fetchedAt).getTime() < 3600_000) {
    return Response.json({ live: cached.payload, fetchedAt: cached.fetchedAt, source: "cache" });
  }
  const live = await fetchLiveNjdg();
  if (live) {
    try {
      cacheNjdg(live.fetchedAt, live.snap);
    } catch { /* ignore */ }
    return Response.json({ live: live.snap, fetchedAt: live.fetchedAt, source: "live" });
  }
  return Response.json({
    live: SNAPSHOT,
    fetchedAt: SNAPSHOT.fetchedAt,
    source: "dated-snapshot (NJDG live fetch failed — see methodology page)",
  });
}

function readNjdgCacheSafe(): { fetchedAt: string; payload: unknown } | null {
  try {
    return readNjdgCache();
  } catch {
    return null;
  }
}
