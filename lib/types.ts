// Shared types + source registry. Every rupee figure in the UI links back here.
export type Bucket = "civil" | "criminal";

export interface EstimateInput {
  caseType: "family" | "property" | "money" | "commercial" | "consumer" | "criminal";
  state: string;
  courtLevel: "district" | "high";
  suitValue: number; // rupees
  advocatePerAppearance: number; // rupees, user-entered
  dailyWage: number; // rupees, user-entered
  daysPerHearing: number; // assumption, default 1
  hearingsPerMonth: number; // assumption, default 1
}

export interface SourceRef {
  label: string;
  url: string;
  accessed: string;
}

export const NJDG_URL = "https://njdg.ecourts.gov.in/";
export const CASE_TYPE_BUCKET: Record<EstimateInput["caseType"], Bucket> = {
  family: "civil",
  property: "civil",
  money: "civil",
  commercial: "civil",
  consumer: "civil",
  criminal: "criminal",
};

export const CASE_TYPE_LABEL: Record<EstimateInput["caseType"], string> = {
  family: "Family / matrimonial",
  property: "Property / land",
  money: "Money recovery",
  commercial: "Commercial dispute",
  consumer: "Consumer dispute",
  criminal: "Criminal complaint / trial",
};
