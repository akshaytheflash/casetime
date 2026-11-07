import {
  CASE_TYPE_BUCKET,
  CASE_TYPE_FORUM,
  CASE_TYPE_LABEL,
  ACCESS_DATE,
  type EstimateInput,
} from "./types";
import { SNAPSHOT, queueClearMonths, pendingPoolPercentiles } from "./njdg";
import {
  courtFeeFor,
  sourcedDailyWage,
  ADVOCATE_SOURCES,
  WAGE_SOURCE,
  RBI,
} from "./fees";
import { checkLegalAid, LEGAL_AID_META, type LegalAidResult } from "./legalAid";
import { buildAlternatives, type Alternative } from "./alternatives";
import { inr, inrShort, months, yearsMonths, pct, num } from "./format";

export interface Cohort {
  n: number;
  medianMonths: number;
  p75Months: number;
  source: string;
  fetchedAt: string;
}

export interface FormulaLine {
  label: string;
  expression: string;
  value: string;
  source: string;
}

export interface TimeEstimate {
  basis: "queue-lower-bound" | "disposed-cohort";
  forum: "civil" | "consumer" | "criminal";
  forumLabel: string;
  bucket: "civil" | "criminal";
  pendency: number;
  disposedPerMonth: number;
  queueClearMonths: number;
  horizonMonths: number;
  monthsUsed: number;
  pool: { p50: number; p75: number; p90: number };
  poolBands: { label: string; count: number; share: number }[];
  poolNote: string;
  contestedShare: number | null;
  hearings: number;
  referenceOnly: boolean;
  derivation: string;
  limitation: string;
  courtLevelNote: string;
  confidence: "low";
  source: string;
  fetchedAt: string;
  cohort: Cohort | null;
}

export interface CostEstimate {
  courtFee: number | null;
  courtFeeNote: string;
  courtFeeSourced: boolean;
  courtFeeBreakdown: string[];
  courtFeeAct: string;
  courtFeeSection: string;
  courtFeeUrl: string;
  advocateTotal: number;
  advocateRaw: number;
  advocateWaived: boolean;
  advocateNote: string;
  opportunityCost: number;
  wageNote: string;
  wageSourced: boolean;
  interest: number;
  interestNote: string;
  litigationCost: number;
  delayCost: number;
  total: number;
  totalExcludesCourtFee: boolean;
  perMonth: number;
  shareOfClaim: number;
  formula: string;
}

export interface EstimateResult extends TimeEstimate, CostEstimate {
  caseLabel: string;
  legalAid: LegalAidResult;
  alternatives: Alternative[];
  formulas: FormulaLine[];
  sources: { label: string; url: string; accessed: string }[];
  isEstimate: true;
  generatedAt: string;
}

const HEARING_CAP_MONTHS = 120;

export function estimate(input: EstimateInput, cohort: Cohort | null = null): EstimateResult {
  const bucket = CASE_TYPE_BUCKET[input.caseType];
  const forum = CASE_TYPE_FORUM[input.caseType];
  const pendency = SNAPSHOT.pendency[bucket];
  const disposed = SNAPSHOT.disposedLastMonth[bucket];
  const queue = queueClearMonths(pendency, disposed);
  const horizon = Math.min(queue, HEARING_CAP_MONTHS);
  const monthsUsed = cohort ? cohort.medianMonths : horizon;
  const hearings = Math.max(1, Math.round(monthsUsed * input.hearingsPerMonth));
  const poolBands = SNAPSHOT.ageBands[bucket].map((count, i) => ({
    label: SNAPSHOT.ageBands.labels[i],
    count,
    share: count / SNAPSHOT.ageBands[bucket].reduce((a, b) => a + b, 0),
  }));
  const pool = pendingPoolPercentiles(SNAPSHOT.ageBands[bucket]);
  const contested =
    SNAPSHOT.disposedContestedLastMonth[bucket] > 0
      ? SNAPSHOT.disposedContestedLastMonth[bucket] / SNAPSHOT.disposedLastMonth[bucket]
      : null;

  const fee = courtFeeFor(input);
  const wage = sourcedDailyWage(input.state);
  const advocateRaw = input.advocatePerAppearance * hearings;
  const legalAid = checkLegalAid(input, advocateRaw);
  const advocate = legalAid.eligible ? 0 : advocateRaw;
  const opportunity = input.dailyWage * hearings * input.daysPerHearing;
  const interest = input.suitValue * (input.repoRate / 100) * (monthsUsed / 12);
  const litigation = (fee.amount ?? 0) + advocate;
  const delay = opportunity + interest;
  const total = litigation + delay;

  const forumLabel =
    forum === "consumer"
      ? "Consumer Commission"
      : forum === "criminal"
        ? "Magistrate / criminal court"
        : "District civil court";
  const referenceOnly = forum === "consumer" || forum === "criminal";

  const derivation = `${num(pendency)} ${bucket} cases pending ÷ ${num(disposed)} disposed in the last month = ${queue.toFixed(2)} months. This is the time to clear today's queue at today's throughput if no new cases arrived (Little's Law). The statement uses ${months(monthsUsed)}${cohort ? " from the disposed-case cohort" : `, capped at ${HEARING_CAP_MONTHS} months for the hearing count`}.`;

  const limitation =
    "This is a queue-based lower bound, not your case's disposal time. NJDG publishes the age of cases still pending, not how long disposed cases took. Cases that settle or dispose early leave the pending pool, so the age bands carry survivorship bias; we show them as the age of the waiting stock and do not use them as disposal times. A disposed-case cohort needs the eCourtsIndia partner key. Without it, read the time figure as an order-of-magnitude floor, not a schedule.";

  const courtLevelNote =
    input.courtLevel === "district"
      ? "District-court aggregates from NJDG (district courts only)."
      : "The NJDG snapshot covers District Courts. High-Court pendency is tracked separately on the HC NJDG dashboard; this estimate shows the District baseline and labels it as such.";

  const alternatives = buildAlternatives({
    caseType: input.caseType,
    state: input.state,
    suitValue: input.suitValue,
    advocatePerAppearance: input.advocatePerAppearance,
    legalAidEligible: legalAid.eligible,
    hearings,
  });

  const formulas: FormulaLine[] = [
    {
      label: "Queue clearance",
      expression: `${num(pendency)} ÷ ${num(disposed)} = ${queue.toFixed(2)} months`,
      value: yearsMonths(queue),
      source: "NJDG, dated snapshot",
    },
    {
      label: "Hearings counted",
      expression: `${monthsUsed.toFixed(1)} months × ${input.hearingsPerMonth} hearing(s)/month = ${hearings}`,
      value: `${hearings}`,
      source: "Your input; NJDG does not publish hearings per case",
    },
    {
      label: "Court fee",
      expression: fee.breakdown.length ? fee.breakdown.join("; ") : "Not yet sourced",
      value: fee.amount === null ? "Not yet sourced" : inr(fee.amount),
      source: fee.sourced ? `${fee.act}, ${fee.section}` : "No source for this State",
    },
    {
      label: "Advocate",
      expression: legalAid.eligible
        ? "Set to ₹0 — legal aid"
        : `${inr(input.advocatePerAppearance)} × ${hearings} hearings`,
      value: inr(advocate),
      source: legalAid.eligible ? "s.12, Legal Services Authorities Act, 1987" : "Your quote; ₹9,000 default is the DSLSA panel rate",
    },
    {
      label: "Lost wages",
      expression: `${inr(input.dailyWage)}/day × ${hearings} hearings × ${input.daysPerHearing} day(s)`,
      value: inr(opportunity),
      source: wage.sourced ? "State notified wage" : "VB-G RAM G national average",
    },
    {
      label: "Cost of money",
      expression: `${inr(input.suitValue)} × ${input.repoRate}% × ${(monthsUsed / 12).toFixed(2)} yr`,
      value: inr(interest),
      source: "RBI repo rate, 7 Oct 2026",
    },
    {
      label: "Total",
      expression: `${inr(litigation)} litigation + ${inr(delay)} delay`,
      value: inr(total),
      source: fee.amount === null ? "Excludes court fee (not yet sourced)" : "Sum of the lines above",
    },
  ];

  const sources = [
    { label: "NJDG pendency and age bands", url: SNAPSHOT.source, accessed: SNAPSHOT.fetchedAt },
    { label: "Court-fee schedule", url: fee.url, accessed: fee.accessed },
    { label: "RBI repo rate", url: RBI.url, accessed: RBI.accessed },
    { label: "VB-G RAM G wage", url: WAGE_SOURCE.url, accessed: WAGE_SOURCE.accessed },
    { label: "Legal aid (s.12)", url: LEGAL_AID_META.url, accessed: ACCESS_DATE },
    { label: "OpenStreetMap courthouse snapshot", url: "https://www.openstreetmap.org/copyright", accessed: ACCESS_DATE },
  ];

  return {
    basis: cohort ? "disposed-cohort" : "queue-lower-bound",
    forum,
    forumLabel,
    bucket,
    pendency,
    disposedPerMonth: disposed,
    queueClearMonths: queue,
    horizonMonths: horizon,
    monthsUsed,
    pool,
    poolBands,
    poolNote:
      "P50 / P75 / P90 are percentiles of the age of cases still pending in the NJDG pool. They are not disposal times and are not used in the cost calculation.",
    contestedShare: contested,
    hearings,
    referenceOnly,
    derivation,
    limitation,
    courtLevelNote,
    confidence: "low",
    source: SNAPSHOT.source,
    fetchedAt: SNAPSHOT.fetchedAt,
    cohort,
    courtFee: fee.amount,
    courtFeeNote: fee.note,
    courtFeeSourced: fee.sourced,
    courtFeeBreakdown: fee.breakdown,
    courtFeeAct: fee.act,
    courtFeeSection: fee.section,
    courtFeeUrl: fee.url,
    advocateTotal: advocate,
    advocateRaw,
    advocateWaived: legalAid.eligible,
    advocateNote: legalAid.eligible
      ? "Set to ₹0: you meet a s.12 criterion. The legal services institution bears the panel lawyer's fee (NALSA legal-aid FAQ)."
      : `${inr(input.advocatePerAppearance)} × ${hearings} hearings. ${ADVOCATE_SOURCES.panelRateNote}`,
    opportunityCost: opportunity,
    wageNote: `${inr(input.dailyWage)}/day × ${hearings} hearings × ${input.daysPerHearing} day(s). ${wage.note}`,
    wageSourced: wage.sourced,
    interest,
    interestNote: `${inr(input.suitValue)} × ${input.repoRate}% × ${(monthsUsed / 12).toFixed(2)} years. ${RBI.note}`,
    litigationCost: litigation,
    delayCost: delay,
    total,
    totalExcludesCourtFee: fee.amount === null,
    perMonth: monthsUsed > 0 ? total / monthsUsed : 0,
    shareOfClaim: input.suitValue > 0 ? total / input.suitValue : 0,
    formula: `Total = court fee (${fee.amount === null ? "not yet sourced" : inr(fee.amount)}) + advocate (${inr(advocate)}) + lost wages (${inr(opportunity)}) + cost of money (${inr(interest)})`,
    caseLabel: CASE_TYPE_LABEL[input.caseType],
    legalAid,
    alternatives,
    formulas,
    sources,
    isEstimate: true,
    generatedAt: new Date().toISOString(),
  };
}

export function headlineNumbers(r: EstimateResult): {
  delayShort: string;
  totalShort: string;
  monthsLabel: string;
  feeShort: string;
} {
  return {
    delayShort: inrShort(r.delayCost),
    totalShort: inrShort(r.total),
    monthsLabel: months(r.monthsUsed),
    feeShort: r.courtFee === null ? "not yet sourced" : inrShort(r.courtFee),
  };
}
