import fees from "../../data/courtFees.json";
import wages from "../../data/wages.json";
import adv from "../../data/advocateFees.json";
import snapshot from "../../data/njdgSnapshot.json";

export const metadata = { title: "CaseTime — Sources" };

const F = fees as unknown as { states: { state: string; openingRate: number; cap: number | null; act: string; source: string; confidence: string }[] };
const W = wages as unknown as { nationalAverage: number; floor: number; source: string; accessed: string; stateWages: { state: string; wage: number | null; source: string }[] };
const A = adv as unknown as { legalAidFloor: { amount: number; unit: string; source: string }; market2026: { source: string } };
const S = snapshot as unknown as { fetchedAt: string; source: string; sourceNote: string; dataGovNote: string };

export default function Sources() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "28px 18px", fontFamily: "system-ui, sans-serif", lineHeight: 1.6 }}>
      <p><a href="/">← Back to estimator</a></p>
      <h1>Data sources</h1>
      <p>Every rupee figure in the app links to a row below (or its in-table source cell) with an access date. “Fee not yet sourced” means exactly that — no guessing.</p>

      <h2>Time — NJDG aggregates</h2>
      <table style={t}>
        <thead><tr><th>Figure</th><th>Value</th><th>Source &amp; access date</th></tr></thead>
        <tbody>
          <tr><td>Pendency (civil / criminal / total)</td><td>1,12,52,654 / 4,08,66,534 / 5,21,19,188</td><td>{S.source} · fetched {S.fetchedAt}<br /><small>{S.sourceNote}</small></td></tr>
          <tr><td>Disposed last month (civil / criminal)</td><td>3,40,163 / 12,37,518</td><td>Same NJDG dashboard, parsed live, {S.fetchedAt}</td></tr>
          <tr><td>Age bands</td><td>&lt;1y 41% · 1–3y 21% · 3–5y 13% · 5–10y 16% · &gt;10y 9%</td><td>Same dashboard ({S.sourceNote})</td></tr>
          <tr><td>data.gov.in NJDG datasets</td><td>Catalog linked, not embedded</td><td>{S.dataGovNote}</td></tr>
        </tbody>
      </table>

      <h2>Court fees (State subject; parent Act: Court Fees Act, 1870)</h2>
      <table style={t}>
        <thead><tr><th>State</th><th>Ad valorem (money suits)</th><th>Act</th><th>Source &amp; access date</th></tr></thead>
        <tbody>
          {F.states.map((s) => (
            <tr key={s.state}>
              <td>{s.state}</td>
              <td>{(s.openingRate * 100).toFixed(1)}% opening{s.cap ? `, cap ₹${s.cap.toLocaleString("en-IN")}` : ", cap not stated — shown as unsourced"}</td>
              <td>{s.act}</td>
              <td>{s.source} (confidence: {s.confidence})</td>
            </tr>
          ))}
          <tr><td>Any other state</td><td colSpan={3}>“Fee not yet sourced” — the app shows the Central schedule above as an explicit fallback and says so. Add a state via the guide in the README.</td></tr>
        </tbody>
      </table>

      <h2>Wages (opportunity cost floor)</h2>
      <table style={t}>
        <thead><tr><th>Scope</th><th>Wage</th><th>Source &amp; access date</th></tr></thead>
        <tbody>
          <tr><td>National average / floor</td><td>₹{W.nationalAverage}/day · floor ₹{W.floor}/day</td><td>{W.source} · accessed {W.accessed}</td></tr>
          {W.stateWages.map((w) => (
            <tr key={w.state}><td>{w.state}</td><td>{w.wage ? `₹${w.wage}/day` : "band (see source)"}</td><td>{w.source}</td></tr>
          ))}
        </tbody>
      </table>

      <h2>Advocate fees</h2>
      <table style={t}>
        <thead><tr><th>Anchor</th><th>Amount</th><th>Source &amp; access date</th></tr></thead>
        <tbody>
          <tr><td>Legal-aid floor (eligible persons)</td><td>₹{A.legalAidFloor.amount.toLocaleString("en-IN")} per {A.legalAidFloor.unit}</td><td>{A.legalAidFloor.source}</td></tr>
          <tr><td>2026 market ranges</td><td>District ₹10k–₹50k · metro HC ₹50k–₹3L</td><td>{A.market2026.source}</td></tr>
        </tbody>
      </table>

      <h2>Workarounds &amp; remedies</h2>
      <ul>
        <li>Section 16, Court Fees Act, 1870 (ADR fee refund) — Indian Kanoon: https://indiankanoon.org/doc/138097064/ (accessed 2026-11-06)</li>
        <li>Legal Services Authorities Act, 1987 · NALSA: https://nalsa.gov.in/pre-instituion-mediation/ (accessed 2026-11-06)</li>
        <li>Commercial Courts Act, 2015, s.12A · NALSA + Pre-Institution Mediation Rules, 2018 (accessed 2026-11-06)</li>
      </ul>

      <h2>LLM &amp; per-case data</h2>
      <ul>
        <li>BharatCode — Qwen 3.8 27B via POST /chat/completions (https://bharatcode.ai/api/model/v1, docs https://bharatcode.ai/build), key server-side in <code>BHARATCODE_API_KEY</code>. Explainer only; math never depends on the model.</li>
        <li>eCourtsIndia partner API — THIRD-PARTY (not government), paid, <code>ECI_KEY (eci_live_…)</code> in .env: GET /api/partner/v2/search, GET /api/partner/case/{"{cnr}"}. Without a key the app shows NJDG aggregates with a banner. CNRs come from search results only.</li>
      </ul>
    </main>
  );
}

const t: React.CSSProperties = { borderCollapse: "collapse", width: "100%", marginBottom: 18 };
