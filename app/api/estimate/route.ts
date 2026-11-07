import type { EstimateInput } from "../../../lib/types";
import { estimate, type Cohort } from "../../../lib/estimator";
import { saveEstimate, recentEstimates } from "../../../lib/db";
import { eciSearch, eciConfigured, eciDisposedCohort, cohortQuery } from "../../../lib/eci";

export const dynamic = "force-dynamic";

const DEFAULTS = {
  caseType: "money" as const,
  state: "Delhi",
  courtLevel: "district" as const,
  suitValue: 500000,
  advocatePerAppearance: 9000,
  dailyWage: 327.4,
  daysPerHearing: 1,
  hearingsPerMonth: 1,
  repoRate: 5.5,
  annualIncome: null as number | null,
  legalAidCategories: [] as string[],
};

function clamp(n: number, lo: number, hi: number): number {
  if (!Number.isFinite(n)) return lo;
  return Math.min(hi, Math.max(lo, n));
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Send a JSON body." }, { status: 400 });
  }

  const suitValue = Number(body.suitValue ?? DEFAULTS.suitValue);
  if (!Number.isFinite(suitValue) || suitValue <= 0) {
    return Response.json({ error: "suitValue must be a number greater than zero." }, { status: 400 });
  }
  if (typeof body.caseType !== "string" || typeof body.state !== "string") {
    return Response.json({ error: "caseType and state are required." }, { status: 400 });
  }

  const rawIncome = body.annualIncome;
  const annualIncome =
    rawIncome === null || rawIncome === undefined || rawIncome === ""
      ? null
      : clamp(Number(rawIncome), 0, 1000000000);

  const input: EstimateInput = {
    caseType: body.caseType as EstimateInput["caseType"],
    state: body.state,
    courtLevel: (body.courtLevel === "high" ? "high" : "district") as EstimateInput["courtLevel"],
    suitValue: clamp(suitValue, 1, 10000000000),
    advocatePerAppearance: clamp(Number(body.advocatePerAppearance ?? DEFAULTS.advocatePerAppearance), 0, 10000000),
    dailyWage: clamp(Number(body.dailyWage ?? DEFAULTS.dailyWage), 0, 1000000),
    daysPerHearing: clamp(Number(body.daysPerHearing ?? DEFAULTS.daysPerHearing), 1, 10),
    hearingsPerMonth: clamp(Number(body.hearingsPerMonth ?? DEFAULTS.hearingsPerMonth), 0.1, 4),
    repoRate: clamp(Number(body.repoRate ?? DEFAULTS.repoRate), 0, 30),
    annualIncome,
    legalAidCategories: Array.isArray(body.legalAidCategories)
      ? (body.legalAidCategories as unknown[]).filter((x): x is string => typeof x === "string")
      : [],
  };

  // Cohort mode is optional and only runs with a partner key. It is bounded so a
  // slow third-party call cannot hold the estimate hostage; on timeout the app
  // falls back to the labelled queue-based lower bound.
  let cohort: Cohort | null = null;
  if (eciConfigured()) {
    cohort = await Promise.race<Cohort | null>([
      eciDisposedCohort(cohortQuery(input.state, input.caseType)).catch(() => null),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 6000)),
    ]);
  }

  const result = estimate(input, cohort);

  try {
    saveEstimate({
      case_type: input.caseType,
      state: input.state,
      court_level: input.courtLevel,
      suit_value: input.suitValue,
      total_cost: Math.round(result.total),
      queue_clear_months: Number(result.queueClearMonths.toFixed(1)),
      result_json: JSON.stringify(result),
    });
  } catch {
    // DB is best-effort (e.g. a read-only local FS); the estimate still returns.
  }

  return Response.json({
    input,
    result,
    cohort,
    mode: eciConfigured() ? "partner-key-present" : "aggregate-statistics",
  });
}

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q");
  if (q !== null) {
    if (!eciConfigured()) {
      return Response.json({
        mode: "aggregate-statistics",
        banner: "Per-case API not configured — showing NJDG aggregates",
        message:
          "Set ECI_KEY (eci_live_...) in .env to enable per-case lookup. CNRs come from search results only; no cases are invented.",
      });
    }
    const r = await eciSearch(q);
    return Response.json({ mode: "per-case", status: r.status, data: r.body });
  }
  return Response.json({ recent: recentEstimates(10) });
}
