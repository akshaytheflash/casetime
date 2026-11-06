import { CASE_TYPE_BUCKET, type EstimateInput } from "./types";
import { SNAPSHOT, queueClearMonths, pendingPoolPercentiles, indianFmt } from "./njdg";
import { courtFeeRule, computeCourtFee, sourcedDailyWage, WAGE_SOURCE, ADVOCATE_SOURCES } from "./fees";

export interface TimeEstimate {
  bucket: "civil" | "criminal";
  pendency: number;
  disposedPerMonth: number;
  queueClearMonths: number;
  queueClearYears: number;
  pool: { p50: number; p75: number; p90: number };
  contestedShare: number | null;
  hearings: number; // derived assumption, user-adjustable inputs echoed back
  monthsOfLitigation: number; // = hearings / hearingsPerMonth
  methodology: string;
  confidence: "low" | "medium-low" | "medium";
  n: number;
  source: string;
  fetchedAt: string;
}

export interface CostEstimate {
  courtFee: number;
  courtFeeNote: string;
  courtFeeSourced: boolean;
  advocateTotal: number;
  advocateNote: string;
  opportunityCost: number;
  wageNote: string;
  total: number;
  formula: string;
}

export interface EstimateResult extends TimeEstimate, CostEstimate {
  courtLevelNote: string;
  isEstimate: true;
}

export function estimate(input: EstimateInput): EstimateResult {
  const bucket = CASE_TYPE_BUCKET[input.caseType];
  const pendency = SNAPSHOT.pendency[bucket];
  const disposed = SNAPSHOT.disposedLastMonth[bucket];
  const clearMonths = queueClearMonths(pendency, disposed);
  const pool = pendingPoolPercentiles(SNAPSHOT.ageBands[bucket]);
  const contested =
    SNAPSHOT.disposedContestedLastMonth[bucket] > 0
      ? SNAPSHOT.disposedContestedLastMonth[bucket] / SNAPSHOT.disposedLastMonth[bucket]
      : null;

  const courtFee = courtFeeRule(input.state);
  const fee = courtFee.rule ? computeCourtFee(input.suitValue, courtFee.rule.openingRate, courtFee.rule.cap) : 0;

  // Hearings model: one hearing per hearingsPerMonth, horizon = queue clearance capped at 120 months.
  // Labelled an ASSUMPTION —NJDG does not publish hearings-per-case.
  const horizonMonths = Math.min(clearMonths, 120);
  const hearings = Math.round(horizonMonths * input.hearingsPerMonth);
  const advocateTotal = input.advocatePerAppearance * hearings;
  const opportunity = input.dailyWage * hearings * input.daysPerHearing;

  const wage = sourcedDailyWage(input.state);
  const total = fee + advocateTotal + opportunity;

  return {
    bucket,
    pendency,
    disposedPerMonth: disposed,
    queueClearMonths: clearMonths,
    queueClearYears: clearMonths / 12,
    pool,
    contestedShare: contested,
    hearings,
    monthsOfLitigation: horizonMonths,
    methodology:
      "Time: NJDG is an HTML dashboard (no public JSON). Pendency and last-month disposals were parsed live from https://njdg.ecourts.gov.in/ on 2026-11-06. Queue clearance = Little's Law (pendency ÷ monthly disposals). P50/P75/P90 are percentiles of the AGE of the pending pool (NJDG age bands), not measured disposal durations — NJDG does not publish per-case durations. Individual disposal is usually far faster than full-queue clearance; the tail (P90) reflects the oldest pending stock. Costs: court fee = state opening ad valorem rate × suit value (capped where the source states a cap; money suits only). Opportunity cost = wage × hearings × days.",
    confidence: "low",
    n: pendency,
    source: SNAPSHOT.source,
    fetchedAt: SNAPSHOT.fetchedAt,
    courtFee: fee,
    courtFeeNote: courtFee.rule
      ? `${input.state}: ${(courtFee.rule.openingRate * 100).toFixed(1)}% opening ad valorem on ₹${indianFmt(input.suitValue)}${courtFee.rule.cap ? `, capped ₹${indianFmt(courtFee.rule.cap)}` : " (cap not stated in source)"}. ${courtFee.rule.act}. Source: ${courtFee.rule.source}`
      : "Fee not yet sourced for this state — enter your state or verify with the court Nazir.",
    courtFeeSourced: courtFee.sourced,
    advocateTotal,
    advocateNote: `₹${indianFmt(input.advocatePerAppearance)} × ${hearings} hearings. Market range 2026 (district): ₹${indianFmt(ADVOCATE_SOURCES.market2026.districtPerAppearance.low)}–₹${indianFmt(ADVOCATE_SOURCES.market2026.districtPerAppearance.high)} per appearance. Legal-aid floor for eligible persons: ₹${indianFmt(ADVOCATE_SOURCES.legalAidFloor.amount)} per appearance. ${ADVOCATE_SOURCES.market2026.source}`,
    opportunityCost: opportunity,
    wageNote: `₹${indianFmt(input.dailyWage)}/day × ${hearings} hearings × ${input.daysPerHearing} day(s). Notified wage reference: ${wage.note}`,
    total,
    formula: `total = court fee (₹${indianFmt(fee)}) + advocate (₹${indianFmt(input.advocatePerAppearance)} × ${hearings}) + opportunity cost (₹${indianFmt(input.dailyWage)} × ${hearings} × ${input.daysPerHearing})`,
    courtLevelNote:
      input.courtLevel === "district"
        ? "District-court aggregates from NJDG (district courts only)."
        : "NJDG snapshot covers District Courts. High-Court pendency is tracked separately at HC NJDG (link in Sources) — this estimate shows the District baseline and is labelled as such.",
    isEstimate: true,
  };
}

/** Cost-vs-time scatter: vary suit value; each point = total cost at queue-clear horizon. */
export function costVsTimePoints(input: EstimateInput): { suitValue: number; total: number; months: number }[] {
  const base = estimate(input);
  const values = [100000, 500000, 1000000, 5000000, 10000000, 25000000, 50000000, 100000000];
  return values.map((v) => {
    const e = estimate({ ...input, suitValue: v });
    return { suitValue: v, total: e.total, months: base.queueClearMonths };
  });
}
