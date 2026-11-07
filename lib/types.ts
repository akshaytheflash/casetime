// Shared types and case-type routing. Every rupee figure carries its source
// through to the UI; nothing is defaulted silently.

export type Bucket = "civil" | "criminal";
export type Forum = "civil" | "criminal" | "consumer";

export type CaseType =
  | "family"
  | "property"
  | "money"
  | "commercial"
  | "consumer"
  | "cheque"
  | "criminal";

export interface EstimateInput {
  caseType: CaseType;
  state: string;
  courtLevel: "district" | "high";
  suitValue: number;
  advocatePerAppearance: number;
  dailyWage: number;
  daysPerHearing: number;
  hearingsPerMonth: number;
  repoRate: number;
  annualIncome: number | null;
  legalAidCategories: string[];
}

export const CASE_TYPE_LABEL: Record<CaseType, string> = {
  family: "Family or matrimonial",
  property: "Property or land",
  money: "Money recovery",
  commercial: "Commercial dispute",
  consumer: "Consumer complaint",
  cheque: "Cheque bounce (s.138)",
  criminal: "Other criminal complaint",
};

export const CASE_TYPE_SHORT: Record<CaseType, string> = {
  family: "Family",
  property: "Property",
  money: "Money recovery",
  commercial: "Commercial",
  consumer: "Consumer",
  cheque: "Cheque bounce",
  criminal: "Criminal",
};

export const CASE_TYPE_FORUM: Record<CaseType, Forum> = {
  family: "civil",
  property: "civil",
  money: "civil",
  commercial: "civil",
  consumer: "consumer",
  cheque: "criminal",
  criminal: "criminal",
};

export const CASE_TYPE_BUCKET: Record<CaseType, Bucket> = {
  family: "civil",
  property: "civil",
  money: "civil",
  commercial: "civil",
  consumer: "civil",
  cheque: "criminal",
  criminal: "criminal",
};

export const CASE_TYPE_HINT: Record<CaseType, string> = {
  family: "Maintenance, custody, matrimonial property. Divorce itself cannot go to a Lok Adalat.",
  property: "Possession, title, partition, boundary. Valued differently from a money suit.",
  money: "Recovery of a debt, damages or compensation. The fee schedule below is for a money suit.",
  commercial: "A dispute under s.2(1)(c) of the Commercial Courts Act, 2015, of specified value.",
  consumer: "The Consumer Commission, not a civil court. The fee follows the consideration paid.",
  cheque: "A criminal complaint before a Magistrate under s.138 of the Negotiable Instruments Act.",
  criminal: "A private criminal complaint or trial. Legal aid is available; a demand notice is not the route.",
};

export const STATES = [
  { id: "Delhi", label: "Delhi", sourced: true },
  { id: "Maharashtra", label: "Maharashtra", sourced: true },
  { id: "Karnataka", label: "Karnataka", sourced: true },
  { id: "Tamil Nadu", label: "Tamil Nadu", sourced: true },
  { id: "Other", label: "Another State (fee not yet sourced)", sourced: false },
] as const;

export const NJDG_URL = "https://njdg.ecourts.gov.in/";

export const ACCESS_DATE = "2026-11-06";

export const ACCESS_DATE_LABEL = "6 November 2026";
