import fees from "../data/courtFees.json";
import wages from "../data/wages.json";
import adv from "../data/advocateFees.json";

export interface FeeRule {
  state: string;
  openingRate: number;
  cap: number | null;
  act: string;
  source: string;
  confidence: string;
}

export function courtFeeRule(state: string): { rule: FeeRule | null; sourced: boolean } {
  const lists = (fees as unknown as { states: FeeRule[] }).states;
  const exact = lists.find(
    (s) => s.state.toLowerCase() === state.toLowerCase()
  );
  if (exact) return { rule: exact, sourced: true };
  const central = lists.find((s) => s.state.startsWith("Other states"));
  return { rule: central ?? null, sourced: false };
}

export function computeCourtFee(suitValue: number, rate: number, cap: number | null): number {
  const raw = rate * suitValue;
  return cap !== null ? Math.min(raw, cap) : raw;
}

export function sourcedDailyWage(state: string): { wage: number; note: string } {
  const w = wages as unknown as {
    nationalAverage: number;
    source: string;
    accessed: string;
    stateWages: { state: string; wage: number | null; source: string }[];
    fallback: string;
  };
  const exact = w.stateWages.find(
    (s) => s.state.toLowerCase() === state.toLowerCase() && s.wage !== null
  );
  if (exact) return { wage: exact.wage as number, note: exact.source };
  return {
    wage: w.nationalAverage,
    note: `${w.fallback} (national avg ₹${w.nationalAverage}/day; ${w.source} accessed ${w.accessed})`,
  };
}

export const WAGE_SOURCE = {
  floor: (wages as unknown as { floor: number }).floor,
  nationalAverage: (wages as unknown as { nationalAverage: number }).nationalAverage,
  source: (wages as unknown as { source: string }).source,
  accessed: (wages as unknown as { accessed: string }).accessed,
  note: (wages as unknown as { note: string }).note,
};

export const ADVOCATE_SOURCES = {
  legalAidFloor: (adv as unknown as { legalAidFloor: { amount: number; unit: string; source: string } }).legalAidFloor,
  market2026: (adv as unknown as { market2026: { source: string; districtPerAppearance: { low: number; high: number } } }).market2026,
  note: (adv as unknown as { note: string }).note,
};
