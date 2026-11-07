import { inr } from "./format";
import type { CaseType } from "./types";

export interface Alternative {
  id: string;
  name: string;
  basis: string;
  basisUrl: string;
  time: string;
  timeBasis: string;
  cost: string;
  costAmount: number | null;
  costNote: string;
  available: boolean;
  unavailableReason?: string;
  recommended: boolean;
  link: string;
  linkLabel: string;
}

export interface AlternativeContext {
  caseType: CaseType;
  state: string;
  suitValue: number;
  advocatePerAppearance: number;
  legalAidEligible: boolean;
  hearings: number;
}

/** Schedule II, Commercial Courts (PIMS) Rules, 2018. */
export function pimsMediationFee(value: number): number | null {
  if (value < 300000) return null;
  if (value <= 1000000) return 15000;
  if (value <= 5000000) return 30000;
  if (value <= 10000000) return 40000;
  if (value <= 30000000) return 50000;
  return 75000;
}

export function buildAlternatives(ctx: AlternativeContext): Alternative[] {
  const value = Math.max(0, ctx.suitValue || 0);
  const pimsFee = pimsMediationFee(value);
  const pimsApplicantCost = pimsFee === null ? null : 1000 + pimsFee / 2;
  const isCheque = ctx.caseType === "cheque";
  const isCommercial = ctx.caseType === "commercial";
  const isCriminal = ctx.caseType === "criminal";
  const isFamily = ctx.caseType === "family";
  const isConsumer = ctx.caseType === "consumer";

  const advocateNote = ctx.legalAidEligible
    ? "A legal-aid panel advocate is free (s.12, Legal Services Authorities Act, 1987)."
    : `If you use a private advocate for one appearance, add about ${inr(ctx.advocatePerAppearance)} (your input; the ₹9,000 default is the Delhi panel rate).`;

  const lokAvailable = !isCriminal;
  const lokReason = isCriminal
    ? "A Lok Adalat cannot take a non-compoundable offence (s.19(5) proviso). If your offence is compoundable, ask the DLSA whether it can be referred."
    : undefined;

  const mediationAvailable = !isCriminal;
  const mediationReason = isCriminal
    ? "Criminal matters are outside the Mediation Act, 2023, except where a court refers a compoundable offence."
    : undefined;

  const pimsAvailable = isCommercial && value >= 300000;
  const pimsReason = !isCommercial
    ? "Only for a commercial dispute under s.2(1)(c) of the Commercial Courts Act, 2015."
    : value < 300000
      ? "The specified value is below ₹3,00,000, so s.12A does not apply."
      : undefined;

  const compoundAvailable = isCheque;
  const compoundReason = !isCheque
    ? "Only for a complaint under s.138 of the Negotiable Instruments Act, 1881."
    : undefined;

  const recommendedId = isCheque
    ? "compounding"
    : isCommercial && value >= 300000
      ? "pims"
      : isFamily
        ? "mediation"
        : isConsumer || ctx.caseType === "money" || ctx.caseType === "property"
          ? "lok-adalat"
          : null;

  return [
    {
      id: "lok-adalat",
      name: "Lok Adalat",
      basis:
        "Legal Services Authorities Act, 1987, ss.19–21. The award is deemed to be a decree of a civil court and is final; no appeal lies (s.21(2)).",
      basisUrl: "https://nalsa.gov.in/lok-adalats/",
      time: "One sitting. No statutory outer limit (s.19).",
      timeBasis: "The Act sets no deadline; the forum is organised by the DLSA/SLSA. This is forum design, not a prediction for your case.",
      cost:
        "₹0 court fee. Where a pending case is referred under s.20(1), the court fee already paid is refunded (s.21(1)).",
      costAmount: 0,
      costNote: advocateNote,
      available: lokAvailable,
      unavailableReason: lokReason,
      recommended: recommendedId === "lok-adalat",
      link: "https://nalsa.gov.in/lok-adalats/",
      linkLabel: "NALSA: how Lok Adalats work",
    },
    {
      id: "pims",
      name: "Pre-institution mediation (commercial)",
      basis:
        "Commercial Courts Act, 2015, s.12A; Commercial Courts (Pre-Institution Mediation and Settlement) Rules, 2018, rr.3 and 11 and Sch. II. A suit that does not contemplate urgent interim relief cannot be instituted without exhausting this route.",
      basisUrl: "https://nalsa.gov.in/pre-instituion-mediation/",
      time: "3 months from the application, extendable by 2 months with the consent of the parties (s.12A(3)).",
      timeBasis: "Statutory outer limit. The limitation clock is excluded while mediation runs (s.12A(3), second proviso).",
      cost:
        pimsApplicantCost === null
          ? "Not available below ₹3,00,000 specified value."
          : `₹1,000 application fee + ${inr(pimsFee! / 2)} share of the ${inr(pimsFee!)} Schedule II fee (shared equally) = ${inr(pimsApplicantCost)}. No court fee because no suit is filed.`,
      costAmount: pimsApplicantCost,
      costNote: advocateNote,
      available: pimsAvailable,
      unavailableReason: pimsReason,
      recommended: recommendedId === "pims",
      link: "https://nalsa.gov.in/pre-instituion-mediation/",
      linkLabel: "NALSA: pre-institution mediation",
    },
    {
      id: "mediation",
      name: "Mediation under the Mediation Act, 2023",
      basis:
        "Mediation Act, 2023, ss.5, 18 and 27. A mediated settlement agreement is final, binding and enforceable in the same manner as a judgment or decree (s.27).",
      basisUrl: "https://upload.indiacode.nic.in/view-casepdf?id=AC_CEN_3_46_00011_A2023-32_1697800640677&type=act",
      time: "120 days from the date fixed for the first appearance, extendable by up to 60 days by agreement (s.18).",
      timeBasis: "Statutory outer limit. The Act does not fix a fee.",
      cost: ctx.legalAidEligible
        ? "No statutory fee. Through a DLSA or court-annexed mediation centre, legal-aid mediation can be free."
        : "No statutory fee. A private mediator or mediation service provider sets the fee; the Act does not fix it.",
      costAmount: ctx.legalAidEligible ? 0 : null,
      costNote: ctx.legalAidEligible
        ? "The DLSA can nominate a mediator and a panel advocate."
        : "Ask the mediator or centre for the fee in writing before the first session. A DLSA/court-annexed centre may be cheaper or free.",
      available: mediationAvailable,
      unavailableReason: mediationReason,
      recommended: recommendedId === "mediation",
      link: "https://upload.indiacode.nic.in/view-casepdf?id=AC_CEN_3_46_00011_A2023-32_1697800640677&type=act",
      linkLabel: "Mediation Act, 2023 (PDF)",
    },
    {
      id: "compounding",
      name: "Compounding a cheque-bounce complaint",
      basis:
        "Negotiable Instruments Act, 1881, s.147: every offence punishable under the Act is compoundable. Section 143A lets the court order interim compensation of up to 20% of the cheque amount.",
      basisUrl: "https://devgan.in/nia/section/147/",
      time: "At any stage with the court's permission (s.147). No statutory outer limit.",
      timeBasis:
        "The s.138 notice must be sent within 30 days of the bank's return memo and gives the drawer 15 days to pay. Compounding itself has no statutory deadline.",
      cost:
        "No statutory compounding fee. The settlement amount is the cheque amount or as agreed; that is money you recover, not a forum cost.",
      costAmount: 0,
      costNote:
        "Court fee already paid on the complaint is not automatically refunded. Interim compensation under s.143A is a recovery, not a cost.",
      available: compoundAvailable,
      unavailableReason: compoundReason,
      recommended: recommendedId === "compounding",
      link: "https://devgan.in/nia/section/147/",
      linkLabel: "NI Act, s.147",
    },
  ];
}
