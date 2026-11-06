import type { ReactNode } from "react";

export const metadata = { title: "CaseTime — Methodology" };

export default function Methodology() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "28px 18px", fontFamily: "system-ui, sans-serif", lineHeight: 1.6 }}>
      <p><a href="/">← Back to estimator</a></p>
      <h1>Methodology</h1>
      <p><strong>CaseTime is an ESTIMATE, not legal advice.</strong> It answers: “given published aggregates, how long is the queue and what would litigation plausibly cost me?”</p>

      <Section title="1. Time — NJDG aggregates, Little's Law + age bands">
        <p>NJDG (National Judicial Data Grid, e-Committee, Supreme Court of India) is the official source for pendency.
        It serves an <strong>HTML dashboard, not public JSON</strong>. We parse the live page server-side
        (<code>lib/njdg.ts</code>) and fall back to a dated snapshot if the page is unreachable. On 2026-11-06 the live
        parse verified: Civil pendency 1,12,52,654; Criminal 4,08,66,534; Total 5,21,19,188; disposed last month
        Civil 3,40,163 / Criminal 12,37,518; age-band string
        <code>4771130~2666765~1462529~1547867~804739</code> (civil).</p>
        <ul>
          <li><strong>Full queue clearance</strong> = pendency ÷ monthly disposals (Little&apos;s Law). This is a <em>system</em> metric — how long the whole backlog would take to clear with no new filings. Individual cases settle far sooner; routine matters routinely dispose in months, not years.</li>
          <li><strong>P50/P75/P90</strong> = percentiles of the <em>age of the pending pool</em> from NJDG age bands (midpoints 0.5/2/4/7.5/12 yrs). NJDG does <strong>not</strong> publish per-case disposal durations, so nothing here is a measured “your case will take X years”.</li>
          <li><strong>Case type</strong>: NJDG splits only Civil vs Criminal. Family/property/money/commercial/consumer map to Civil; criminal maps to Criminal. No finer splits are invented.</li>
          <li><strong>Court level</strong>: the snapshot covers District Courts. High-Court data lives on the HC NJDG dashboard (linked in Sources); when “High Court” is selected the app shows the District baseline labelled as such.</li>
          <li><strong>n</strong> = the exact pendency count used (shown per estimate). Every figure cites source + fetch date.</li>
        </ul>
      </Section>

      <Section title="2. Cost — fees, advocate, opportunity">
        <ul>
          <li><strong>Court fee</strong> = state opening ad valorem rate × suit value, capped where the source states a cap. Court fees are a State subject (Entry 3, State List; parent Act Court Fees Act, 1870). Our four sourced states (Delhi 5%/₹2L cap, Maharashtra 6%/₹3L, Karnataka 7.5%, Tamil Nadu 7.5%/₹2L) come from the cited summary + Act texts; “Other states” uses the Central schedule. Money suits only — declaratory/injunction/multiple-relief fees differ; verify with the Nazir / e-filing system before filing. Unknown → “Fee not yet sourced”, never a guess.</li>
          <li><strong>Advocate fees</strong>: no statutory schedule exists. We show the DSLSA legal-aid floor (₹9,000/appearance, eligible persons) and 2026 market ranges (district ₹10k–₹50k) with citations. The user&apos;s own quote always wins.</li>
          <li><strong>Opportunity cost</strong> = wage × hearings × days. Wages are the notified rural employment-guarantee wage (VB-G RAM G 2025 / PIB 30 Jun 2026: national avg ₹327.4, floor ₹300; Haryana ₹409, Goa ₹406, Kerala ₹401). Urban wages are higher — the formula is shown so users can substitute their own.</li>
          <li><strong>Hearings</strong>: hearings = clearance months × hearings-per-month. NJDG does not publish hearings-per-case; both inputs are user-visible assumptions (default 1/month, 1 day/hearing).</li>
        </ul>
      </Section>

      <Section title="3. Workarounds">
        <p>Mediation (s.89 CPC), Lok Adalat (Legal Services Authorities Act, 1987), and pre-institution mediation for commercial disputes ≥₹3 lakh (Commercial Courts Act, 2015, s.12A) are summarised on the home page with statute citations. They are options to discuss with a legal-aid clinic, not recommendations for any specific case.</p>
      </Section>

      <Section title="4. Confidence & limits">
        <ul>
          <li>Time: <strong>low</strong> confidence — aggregates only, no case-level durations. Useful for order-of-magnitude planning, not scheduling.</li>
          <li>Costs: <strong>medium</strong> — fees/advocate/wages are anchored to cited schedules, but your hearing count drives the total.</li>
          <li>Per-case lookup (eCourtsIndia partner API) is THIRD-PARTY/paid and key-gated; without <code>ECI_KEY</code> the app runs in aggregate mode with a banner. We never scrape services.ecourts.gov.in and never invent CNRs — CNRs come only from search results.</li>
          <li>The BharatCode explainer (Qwen 3.8 27B via /chat/completions) is optional polish; on 503s it falls back to a template with the same numbers. LLM availability never affects the math.</li>
        </ul>
      </Section>
    </main>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ marginTop: 20, border: "1px solid #d8d8d8", borderRadius: 10, padding: 16 }}>
      <h2 style={{ marginTop: 0 }}>{title}</h2>
      {children}
    </section>
  );
}
