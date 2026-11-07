import feeData from "../data/courtFees.json";
import wageData from "../data/wages.json";
import advData from "../data/advocateFees.json";
import rbiData from "../data/rbi.json";
import { inr, num, pct } from "./format";
import type { CaseType } from "./types";

export type FeeRule =
  | { type: "single"; rows: { max: number | null; rate: number; min?: number }[]; cap?: number | null }
  | { type: "base_plus"; rows: { max: number | null; base: number; from: number; rate: number }[]; cap?: number | null }
  | {
      type: "cumulative";
      bands: { max: number | null; flat?: number; from?: number; step?: number; perStep?: number }[];
      cap?: number | null;
    }
  | { type: "flat_slab"; rows: { max: number | null; amount: number }[]; cap?: number | null };

interface StateFee {
  state: string;
  act: string;
  section: string;
  url: string;
  textUrl?: string;
  accessed: string;
  rule: FeeRule;
  note: string;
}

const FEES = feeData as unknown as {
  note: string;
  accessed: string;
  states: StateFee[];
  central: StateFee;
  consumer: StateFee;
};

export interface FeeResult {
  amount: number | null;
  sourced: boolean;
  act: string;
  section: string;
  url: string;
  accessed: string;
  note: string;
  breakdown: string[];
  kind: "state" | "consumer" | "cheque" | "none";
}

export function computeFee(value: number, rule: FeeRule): { amount: number; breakdown: string[]; capped: boolean } {
  const breakdown: string[] = [];
  let amount = 0;

  if (rule.type === "single") {
    const row =
      rule.rows.find((r) => r.max === null || value <= r.max) ?? rule.rows[rule.rows.length - 1];
    amount = value * row.rate;
    if (row.min !== undefined) amount = Math.max(amount, row.min);
    const minNote = row.min !== undefined ? ` (minimum ${inr(row.min)})` : "";
    breakdown.push(`${pct(row.rate)} of ${inr(value)}${minNote} = ${inr(amount)}`);
  } else if (rule.type === "base_plus") {
    const row =
      rule.rows.find((r) => r.max === null || value <= r.max) ?? rule.rows[rule.rows.length - 1];
    amount = row.base + row.rate * Math.max(0, value - row.from);
    if (row.base > 0) {
      breakdown.push(
        `${inr(row.base)} + ${pct(row.rate)} × (${inr(value)} − ${inr(row.from)}) = ${inr(amount)}`
      );
    } else {
      breakdown.push(`${pct(row.rate)} of ${inr(value)} = ${inr(amount)}`);
    }
  } else if (rule.type === "cumulative") {
    for (const band of rule.bands) {
      if (band.flat !== undefined) {
        amount += band.flat;
        breakdown.push(`First ${inr(band.max ?? value)}: ${inr(band.flat)}`);
      } else if (band.from !== undefined && band.step && band.perStep) {
        const upper = Math.min(value, band.max ?? value);
        if (upper > band.from) {
          const units = Math.ceil((upper - band.from) / band.step);
          const add = units * band.perStep;
          amount += add;
          breakdown.push(
            `${inr(band.perStep)} per ${inr(band.step)} (or part) on ${inr(upper - band.from)} = ${inr(add)}`
          );
        }
      }
      if (band.max !== null && value <= band.max) break;
    }
    breakdown.push(`Subtotal = ${inr(amount)}`);
  } else {
    const row =
      rule.rows.find((r) => r.max === null || value <= r.max) ?? rule.rows[rule.rows.length - 1];
    amount = row.amount;
    breakdown.push(
      row.amount === 0
        ? `Nil for value up to ${inr(row.max)}`
        : `Flat ${inr(row.amount)} for value up to ${inr(row.max)}`
    );
  }

  let capped = false;
  if (rule.cap && amount > rule.cap) {
    breakdown.push(`Capped at ${inr(rule.cap)}`);
    amount = rule.cap;
    capped = true;
  }

  return { amount: Math.round(amount * 100) / 100, breakdown, capped };
}

function stateRule(state: string): StateFee | null {
  return FEES.states.find((s) => s.state.toLowerCase() === state.toLowerCase()) ?? null;
}

export function courtFeeFor(input: {
  state: string;
  caseType: CaseType;
  suitValue: number;
}): FeeResult {
  const value = Math.max(0, input.suitValue || 0);

  if (input.caseType === "consumer") {
    const c = FEES.consumer;
    const out = computeFee(value, c.rule);
    return {
      amount: out.amount,
      sourced: true,
      act: c.act,
      section: c.section,
      url: c.url,
      accessed: c.accessed,
      note: c.note,
      breakdown: out.breakdown,
      kind: "consumer",
    };
  }

  if (input.caseType === "cheque") {
    const delhi = stateRule("Delhi");
    if (input.state === "Delhi" && delhi) {
      const out = computeFee(value, delhi.rule);
      return {
        amount: out.amount,
        sourced: true,
        act: delhi.act,
        section: "Schedule I, Article 3 (s.138 NI Act complaint)",
        url: delhi.url,
        accessed: delhi.accessed,
        note:
          "Delhi Article 3 applies the Article 1 scale to a complaint under s.138 of the Negotiable Instruments Act, 1881, calculated on the value of the instrument. Other States may prescribe a different fee for a criminal complaint; this app does not guess it.",
        breakdown: out.breakdown,
        kind: "cheque",
      };
    }
    return {
      amount: null,
      sourced: false,
      act: "Court fee for a s.138 complaint",
      section: "Not yet sourced for this State",
      url: "",
      accessed: "",
      note: `The court fee for a s.138 complaint in ${input.state === "Other" ? "this State" : input.state} is not yet sourced in this app. The total below excludes it. Ask the court's filing counter or the DLSA before you file.`,
      breakdown: [],
      kind: "none",
    };
  }

  const rule = stateRule(input.state);
  if (!rule) {
    return {
      amount: null,
      sourced: false,
      act: "State court-fee schedule",
      section: "Not yet sourced",
      url: "",
      accessed: "",
      note:
        "The court-fee schedule for this State is not yet sourced in this app. The total below excludes the court fee. The parent Act is the Court Fees Act, 1870; check your State's schedule with the court's filing counter or the DLSA.",
      breakdown: [],
      kind: "none",
    };
  }

  const out = computeFee(value, rule.rule);
  return {
    amount: out.amount,
    sourced: true,
    act: rule.act,
    section: rule.section,
    url: rule.url,
    accessed: rule.accessed,
    note: rule.note,
    breakdown: out.breakdown,
    kind: "state",
  };
}

export function sourcedDailyWage(state: string): { wage: number; note: string; sourced: boolean } {
  const w = wageData as unknown as {
    nationalAverage: number;
    source: string;
    accessed: string;
    stateWages: { state: string; wage: number | null; source: string }[];
    fallback: string;
  };
  const exact = w.stateWages.find(
    (s) => s.state.toLowerCase() === state.toLowerCase() && s.wage !== null
  );
  if (exact) {
    return { wage: exact.wage as number, note: exact.source, sourced: true };
  }
  return {
    wage: w.nationalAverage,
    note: `${w.fallback} (national average ₹${num(w.nationalAverage)}/day; ${w.source}, accessed ${w.accessed})`,
    sourced: false,
  };
}

export const WAGE_SOURCE = {
  floor: (wageData as unknown as { floor: number }).floor,
  nationalAverage: (wageData as unknown as { nationalAverage: number }).nationalAverage,
  source: (wageData as unknown as { source: string }).source,
  url: (wageData as unknown as { url: string }).url,
  accessed: (wageData as unknown as { accessed: string }).accessed,
  note: (wageData as unknown as { note: string }).note,
  stateWages: (wageData as unknown as { stateWages: { state: string; wage: number | null; source: string }[] })
    .stateWages,
};

export const ADVOCATE_SOURCES = {
  legalAidFloor: (advData as unknown as { legalAidFloor: { amount: number; unit: string; source: string } }).legalAidFloor,
  panelRateNote: (advData as unknown as { panelRateNote: string }).panelRateNote,
  legalAidCover: (advData as unknown as { legalAidCover: { source: string } }).legalAidCover,
};

export const RBI = rbiData as unknown as {
  repoRate: number;
  asOf: string;
  source: string;
  url: string;
  accessed: string;
  note: string;
};

export const FEE_SOURCE_NOTE = FEES.note;
export const FEE_ACCESSED = FEES.accessed;
export const CENTRAL_FEE = FEES.central;
export const CONSUMER_FEE = FEES.consumer;
export const STATE_FEES = FEES.states;
