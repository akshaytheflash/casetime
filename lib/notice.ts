import { inr } from "./format";
import type { EstimateInput } from "./types";

export interface GeneratedNotice {
  title: string;
  kind: "cheque" | "commercial" | "consumer" | "civil" | "criminal";
  body: string;
  steps: string[];
  basis: string;
  basisUrl: string;
}

function amount(n: number): string {
  return inr(n);
}

export function buildNotice(input: EstimateInput): GeneratedNotice {
  const value = amount(input.suitValue);

  if (input.caseType === "cheque") {
    return {
      title: "Notice under section 138 of the Negotiable Instruments Act, 1881",
      kind: "cheque",
      basis: "s.138, Negotiable Instruments Act, 1881 (proviso (b): notice within 30 days of the bank's return memo; 15 days to pay)",
      basisUrl: "https://devgan.in/nia/section/138/",
      body: `NOTICE UNDER SECTION 138 OF THE NEGOTIABLE INSTRUMENTS ACT, 1881

From: [your full name]
[your address]
[your phone] · [your email]

To: [drawer's full name]
[drawer's address]

Date: [date]

Subject: Dishonour of cheque no. [cheque number] dated [cheque date] for ${value}

1. I am the holder/payee of cheque no. [cheque number] dated [cheque date], drawn on [bank and branch], for ${value}, issued by you in discharge of [state the debt or liability, with the date and document].

2. I presented the cheque on [presentation date]. It was returned unpaid on [return date] with the bank's return memo reading: "[reason printed on the memo]". A copy of the memo is enclosed.

3. Under the proviso to section 138 of the Negotiable Instruments Act, 1881, you are called upon to pay ${value} within 15 days of the receipt of this notice.

4. If you do not pay within that period, I will file a complaint under section 138 before the competent Magistrate. Section 143A permits the court to order interim compensation of up to 20% of the cheque amount.

5. This notice is sent by [registered post / speed post / courier / email] and a copy is retained for the court record.

[signature]
[your name]

Enclosures: copy of the cheque; bank return memo; [invoice/agreement].`,
      steps: [
        "Send this within 30 days of the bank's return memo. The 30-day clock is in the proviso to s.138.",
        "Keep the postal receipt, the tracking record and the original return memo. They are evidence.",
        "Do not file the complaint before the 15-day payment window expires. The court will want proof of the notice and its receipt.",
        "Have a DLSA panel lawyer read it before you send it. A defective notice can end the complaint.",
      ],
    };
  }

  if (input.caseType === "commercial" && input.suitValue >= 300000) {
    return {
      title: "Request for pre-institution mediation under section 12A",
      kind: "commercial",
      basis: "s.12A, Commercial Courts Act, 2015; Commercial Courts (Pre-Institution Mediation and Settlement) Rules, 2018",
      basisUrl: "https://nalsa.gov.in/pre-instituion-mediation/",
      body: `REQUEST FOR PRE-INSTITUTION MEDIATION UNDER SECTION 12A OF THE COMMERCIAL COURTS ACT, 2015

To: The Member Secretary
[District Legal Services Authority], [district]

From: [your full name / company name]
[address]
[phone] · [email]

Opposite party: [name]
[address]

Date: [date]

Subject: Request for pre-institution mediation — commercial dispute of ${value}

1. The applicant and the opposite party are parties to a commercial dispute within the meaning of section 2(1)(c) of the Commercial Courts Act, 2015, arising from [describe the contract, invoice or transaction, with dates].

2. The specified value of the dispute is ${value}, which is not less than ₹3,00,000.

3. The applicant does not contemplate any urgent interim relief under the Act.

4. The applicant requests the Authority to initiate pre-institution mediation under section 12A and the Commercial Courts (Pre-Institution Mediation and Settlement) Rules, 2018.

5. The applicant will pay the ₹1,000 application fee under rule 3(1) and the Schedule II mediation fee under rule 11, to be shared equally.

6. The applicant proposes [name / no preference] as mediator, and requests that the mediation be completed within the three-month period in section 12A(3).

[signature]
[your name]

Enclosures: contract/invoice; statement of account; demand notice dated [date]; proof of dispatch.`,
      steps: [
        "File this with the DLSA/Authority before you file the commercial suit. Section 12A is mandatory unless urgent interim relief is genuinely contemplated.",
        "Attach the contract, invoices and a clear statement of account. The mediator needs a number both sides can test.",
        "The limitation clock is excluded while the mediation runs (s.12A(3), second proviso). Keep the application acknowledgement.",
        "If mediation fails, ask for the non-settlement report. It goes with the plaint.",
      ],
    };
  }

  if (input.caseType === "consumer") {
    return {
      title: "Notice of deficiency in service or defect in goods",
      kind: "consumer",
      basis: "s.35, Consumer Protection Act, 2019; Consumer Protection (Consumer Disputes Redressal Commissions) Rules, 2020, r.7(2)",
      basisUrl: "https://consumerhelpline.gov.in/public/knowledgebasedetails/Consumer%20Protection%20Act%202019",
      body: `NOTICE OF DEFICIENCY IN SERVICE / DEFECT IN GOODS AND DEMAND FOR REDRESSAL

From: [your full name]
[your address]
[your phone] · [your email]

To: [opposite party / seller / service provider]
[address]

Date: [date]

Subject: Deficiency in service / defect in goods supplied on [date] — claim ${value}

1. I purchased [goods / service] from you on [date] for ${value}, under invoice/bill no. [number]. A copy is enclosed.

2. The defect or deficiency is: [describe the defect, the date it appeared, and what you asked for].

3. I complained on [date] by [phone / email / letter]. Your response was [no response / refusal / incomplete remedy].

4. I call upon you to [repair / replace / refund / pay compensation] within 15 days of receiving this notice.

5. If you do not, I will file a complaint before the District Consumer Disputes Redressal Commission under section 35 of the Consumer Protection Act, 2019, and seek the relief available under sections 39 and 2(11). The filing fee is nil where the consideration paid is up to ₹5,00,000 (rule 7(2)).

[signature]
[your name]

Enclosures: invoice; warranty; photographs; correspondence.`,
      steps: [
        "File within 2 years of the date the defect or deficiency arose (s.69, Consumer Protection Act, 2019).",
        "File online through the e-Daakhil portal or at the District Commission. The fee is nil up to ₹5,00,000 of consideration.",
        "Keep the invoice and the complaint trail. The Commission will ask for them at admission.",
        "A DLSA panel lawyer can draft and file the complaint; legal aid is free if you meet a s.12 criterion.",
      ],
    };
  }

  if (input.caseType === "criminal") {
    return {
      title: "No pre-litigation notice is generated for a criminal complaint",
      kind: "criminal",
      basis: "A private complaint is filed before the Magistrate; the DLSA can draft it. See s.223, Bharatiya Nagarik Suraksha Sanhita, 2023.",
      basisUrl: "https://nalsa.gov.in/legal-aid/",
      body: `A criminal complaint is not started with a demand notice. The route is a private complaint before the competent Magistrate, or a police complaint where the law provides for one.

What the DLSA can do:
- draft the complaint and the list of witnesses;
- explain the limitation and limitation-saving provisions;
- apply for victim compensation or interim relief where a scheme applies;
- provide a panel advocate at no cost if you meet a s.12 criterion.

Take to the DLSA: your ID, proof of the s.12 category (if any), an income affidavit (if the income route applies), the facts in date order, and copies of every document you have.

This page does not generate a criminal complaint. A template cannot safely capture the offence, the limitation, the witnesses and the relief; a panel lawyer should draft it.`,
      steps: [
        "Go to the DLSA for your district with the documents listed above.",
        "Ask for a panel advocate and for help with victim compensation, if it applies.",
        "Do not send a demand notice in place of a criminal complaint. It does not stop limitation.",
      ],
    };
  }

  return {
    title: "Pre-litigation demand notice",
    kind: "civil",
    basis: "A demand notice is not a statutory precondition for every civil suit; it narrows the issues and can settle the matter. Have a DLSA lawyer adapt it.",
    basisUrl: "https://nalsa.gov.in/legal-aid/",
    body: `PRE-LITIGATION DEMAND NOTICE

From: [your full name]
[your address]
[your phone] · [your email]

To: [opposite party]
[address]

Date: [date]

Subject: Demand for ${value} under [contract / loan / agreement / family settlement] dated [date]

1. Under [the document and clause], you are liable to pay me ${value} on account of [state the consideration and the breach].

2. Despite my requests dated [date] and [date], you have not paid. A statement of account is enclosed.

3. I call upon you to pay ${value} within 15 days of receiving this notice, together with [interest / costs, if claimed].

4. If you do not pay, I will file a suit for recovery before the competent court, without further notice. I will rely on this notice and the enclosed documents.

5. This notice is sent by [registered post / speed post / courier / email] and a copy is retained.

[signature]
[your name]

Enclosures: the agreement/loan document; statement of account; proof of the earlier demands.`,
    steps: [
      "Send it by a method that gives you proof of dispatch and, if possible, proof of delivery.",
      "Attach the document that creates the liability and a clear statement of account. A notice without the basis is easy to ignore.",
      "A demand notice does not stop limitation. Check the limitation period for your claim before you rely on settlement talks.",
      "Have a DLSA panel lawyer adapt the notice to your facts before you send it.",
    ],
  };
}
