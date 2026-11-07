export const WORKAROUNDS = [
  {
    id: "mediation",
    title: "1. Mediation (Section 89 CPC)",
    when: "A negotiated settlement is acceptable and both sides will engage.",
    how: "After filing, the court can refer parties to mediation under Section 89 CPC. The mediator facilitates; the settlement, if signed, becomes a decree. Court-fee refund: where the court refers parties to ADR, Section 16 of the Court Fees Act entitles the plaintiff to a certificate for refund of the fee paid.",
    costTime: "Typically weeks to a few months, versus years in court. s.16 itself does not give a percentage: it says the plaintiff is entitled to a certificate to recover “the full amount of the fee paid”. Read the section text below; confirm the practice with the court.",
    source: "Court Fees Act, 1870, s.16 (verbatim on Indian Kanoon, https://indiankanoon.org/doc/138097064/), accessed 2026-11-06. The Act refers to s.89 CPC modes of settlement and sets no percentage; no secondary fee-calculator is relied on.",
  },
  {
    id: "lok-adalat",
    title: "2. Lok Adalat (Legal Services Authorities Act, 1987)",
    when: "A compromise is possible before or during a case, including pre-litigation disputes.",
    how: "Lok Adalats organised by Legal Services Authorities take up pending cases and pre-litigation disputes. A settlement award is deemed a civil court decree, enforceable, with no court fee payable on the settlement and no appeal (except via writ).",
    costTime: "One sitting or a few dates. No court fee; a settlement can save years of hearings. Unsettled pre-litigation matters are passed to the regular court route.",
    source: "Legal Services Authorities Act, 1987; NALSA (https://nalsa.gov.in/pre-instituion-mediation/), accessed 2026-11-06.",
  },
  {
    id: "commercial-12a",
    title: "3. Pre-institution mediation for commercial disputes (Commercial Courts Act, 2015, s.12A)",
    when: "The dispute is a 'commercial dispute' with Specified Value of ₹3 lakh or more and no urgent interim relief is needed.",
    how: "Section 12A mandates pre-institution mediation through the Legal Services Authority before a commercial suit can be filed. If mediation fails, the Non-Settlement Report is filed with the plaint. Limitation is protected between the s.12A application and its conclusion.",
    costTime: "The Authority must attempt settlement within a few months; limitation pauses meanwhile, so the legal clock is protected while you try the cheap route first.",
    source: "Commercial Courts Act, 2015, s.12A; Commercial Courts (Pre-Institution Mediation and Settlement) Rules, 2018 (High Court of Delhi, https://thc.nic.in ); NALSA pre-institution mediation page, accessed 2026-11-06. 'Specified Value ₹3 lakh' threshold widely reported (e.g. Global Law Experts), accessed 2026-11-06.",
  },
  {
    id: "notice",
    title: "Bonus: pre-litigation legal notice + conciliation",
    when: "You have not filed yet and the other side may settle after a formal demand.",
    how: "A pre-litigation notice (often drafted with a legal-aid clinic) frames the claim and the deadline. For suitable disputes, Legal Services Authorities run pre-litigation conciliation before a case is filed. Even when it does not settle, a clear notice often narrows the issues and can improve costs arguments later.",
    costTime: "Days to a few weeks. Far cheaper than a suit if it works.",
    source: "Legal Services Authorities Act, 1987 (pre-litigation conciliation); NALSA (https://nalsa.gov.in/pre-instituion-mediation/), accessed 2026-11-06.",
  },
];
