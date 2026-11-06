import type { EstimateInput } from "../../../lib/types";
import { estimate, costVsTimePoints } from "../../../lib/estimator";
import { saveEstimate, recentEstimates } from "../../../lib/db";
import { eciSearch, eciConfigured } from "../../../lib/eci";
import { bharatcodeExplain, templateExplainer } from "../../../lib/bharatcode";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const input = (await req.json()) as EstimateInput;
  if (!input?.caseType || !input?.state || !(input.suitValue > 0)) {
    return Response.json({ error: "caseType, state and suitValue>0 are required" }, { status: 400 });
  }
  const result = estimate(input);
  const scatter = costVsTimePoints(input);
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
    // DB best-effort (e.g. /api/health checks); estimate still returned
  }
  let explainer: { text: string; via: "llm" | "fallback" } = { text: "", via: "fallback" };
  const prompt = `Explain this estimate in plain language for a first-time litigant. Do not give legal advice.\n${JSON.stringify(
    { caseType: input.caseType, state: input.state, courtLevel: input.courtLevel, suitValue: input.suitValue, total: Math.round(result.total), queueClearYears: Number(result.queueClearYears.toFixed(2)), pool: result.pool },
    null, 2
  )}`;
  try {
    const r = await bharatcodeExplain(prompt);
    explainer = r.text ? r : { text: templateExplainer(prompt), via: "fallback" };
  } catch {
    explainer = { text: templateExplainer(prompt), via: "fallback" };
  }
  return Response.json({ input, result, scatter, explainer });
}

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q");
  if (q !== null) {
    if (!eciConfigured()) {
      return Response.json({
        mode: "aggregate-statistics",
        banner: "Per-case API not configured — showing NJDG aggregates",
        message: "Set ECI_KEY (eci_live_...) in .env to enable per-case lookup. CNRs come from search results only; no cases are invented.",
      });
    }
    const r = await eciSearch(q);
    return Response.json({ mode: "per-case", status: r.status, data: r.body });
  }
  return Response.json({ recent: recentEstimates(10) });
}
