import aid from "../data/legalAid.json";
import type { EstimateInput } from "./types";

export interface AidCategory {
  id: string;
  label: string;
  cite: string;
}

export interface LegalAidResult {
  status: "eligible" | "not-eligible" | "unknown";
  eligible: boolean;
  matched: AidCategory[];
  incomeLimit: number | null;
  incomeLimitSource: string;
  authority: { name: string; url: string; note: string };
  applyUrl: string;
  advocateSaving: number;
  note: string;
  courtFeeNote: string;
  order33Url: string;
  categoriesForState: AidCategory[];
}

const AID = aid as unknown as {
  act: string;
  section: string;
  url: string;
  textUrl: string;
  note: string;
  categories: AidCategory[];
  income: Record<
    string,
    { limit: number; source: string; extra: { id: string; label: string; limit: number | null; cite: string }[] }
  >;
  authorities: Record<string, { name: string; url: string; note: string }>;
  fallbackAuthority: { name: string; url: string; note: string };
  applyUrl: string;
  courtFeeNote: string;
  order33Url: string;
};

export function categoriesForState(state: string): AidCategory[] {
  const general = AID.categories;
  const extra = AID.income[state]?.extra ?? [];
  return [...general, ...extra.map((e) => ({ id: e.id, label: e.label, cite: e.cite }))];
}

export function checkLegalAid(input: EstimateInput, advocateTotal: number): LegalAidResult {
  const stateData = AID.income[input.state];
  const selected = new Set(input.legalAidCategories);
  const matched: AidCategory[] = [];

  for (const c of AID.categories) {
    if (selected.has(c.id)) matched.push(c);
  }

  for (const e of stateData?.extra ?? []) {
    if (!selected.has(e.id)) continue;
    if (e.limit === null) {
      matched.push({ id: e.id, label: e.label, cite: e.cite });
    } else if (input.annualIncome !== null && input.annualIncome <= e.limit) {
      matched.push({ id: e.id, label: e.label, cite: e.cite });
    }
  }

  if (stateData && input.annualIncome !== null && input.annualIncome <= stateData.limit) {
    matched.push({
      id: "income",
      label: `Annual income below the ${input.state} ceiling of ₹${stateData.limit.toLocaleString("en-IN")}`,
      cite: "s.12(h)",
    });
  }

  const eligible = matched.length > 0;
  let status: LegalAidResult["status"] = "unknown";
  if (eligible) status = "eligible";
  else if (stateData && input.annualIncome !== null) status = "not-eligible";

  const authority = AID.authorities[input.state] ?? AID.fallbackAuthority;

  let note: string;
  if (eligible) {
    note =
      "You meet at least one s.12 criterion on the information entered. The Authority must still be satisfied that there is a prima facie case to prosecute or defend (s.13(1)). Take proof of the category and, where income is the route, an affidavit of income — s.13(2) says an affidavit is generally sufficient.";
  } else if (status === "not-eligible") {
    note = `On the income you entered, you are above the ${input.state} ceiling of ₹${stateData?.limit.toLocaleString("en-IN")}. The category routes in s.12(a)–(g) do not depend on income — if any of them apply, select them above. If your circumstances change, the DLSA can reassess.`;
  } else {
    note =
      "No s.12 category is selected and no annual income is entered, so eligibility is not assessed. A woman or child qualifies under s.12(c) irrespective of income. If none of the categories apply, enter your annual income to test the s.12(h) route.";
  }

  return {
    status,
    eligible,
    matched,
    incomeLimit: stateData?.limit ?? null,
    incomeLimitSource: stateData?.source ?? "",
    authority,
    applyUrl: AID.applyUrl,
    advocateSaving: eligible ? advocateTotal : 0,
    note,
    courtFeeNote: AID.courtFeeNote,
    order33Url: AID.order33Url,
    categoriesForState: categoriesForState(input.state),
  };
}

export const LEGAL_AID_META = {
  act: AID.act,
  section: AID.section,
  url: AID.url,
  textUrl: AID.textUrl,
  note: AID.note,
  income: AID.income,
  authorities: AID.authorities,
};

export const LEGAL_AID_CATEGORIES = AID.categories;
