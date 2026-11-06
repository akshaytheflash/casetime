import type { EstimateResult } from "../lib/estimator";
import { indianFmt } from "../lib/njdg";

export default function Results({ result, scatter, explainer }: {
  result: EstimateResult;
  scatter: { suitValue: number; total: number; months: number }[];
  explainer: { text: string; via: "llm" | "fallback" };
}) {
  return (
    <section style={{ marginTop: 18, display: "grid", gap: 14 }}>
      <div style={{ background: "#fff7e0", border: "1px solid #e6c84f", borderRadius: 10, padding: 12 }}>
        <strong>Estimate only — not legal advice.</strong> Time is derived from NJDG pendency aggregates
        (Little&apos;s Law + pending-pool age bands). It is <em>not</em> a prediction for your case. See{" "}
        <a href="/methodology">Methodology</a> for limits and confidence.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 }}>
        <Card title="Full queue clearance" big={`${result.queueClearYears.toFixed(2)} yrs (${Math.round(result.queueClearMonths)} mo)`}
          sub={`${indianFmt(result.pendency)} pending · ${indianFmt(result.disposedPerMonth)}/mo disposed`} />
        <Card title="Pending-pool age: P50 / P75 / P90" big={`${result.pool.p50} / ${result.pool.p75} / ${result.pool.p90} yrs`}
          sub="Age of cases still pending — not disposal times" />
        <Card title="Total cost (planning horizon)" big={`₹${indianFmt(result.total)}`}
          sub={`${result.hearings} hearings · ${Math.round(result.monthsOfLitigation)} months`} />
        <Card title="Contested share (last month)" big={result.contestedShare !== null ? `${Math.round(result.contestedShare * 100)}%` : "—"}
          sub="Share of disposals that were contested" />
      </div>

      <div style={{ border: "1px solid #d8d8d8", borderRadius: 10, padding: 14 }}>
        <h3 style={{ marginTop: 0 }}>Cost breakdown</h3>
        <table style={tbl}>
          <tbody>
            <tr><td>Court fee</td><td>₹{indianFmt(result.courtFee)}</td></tr>
            <tr><td>Advocate fees</td><td>₹{indianFmt(result.advocateTotal)}</td></tr>
            <tr><td>Opportunity cost</td><td>₹{indianFmt(result.opportunityCost)}</td></tr>
            <tr><td><strong>Total</strong></td><td><strong>₹{indianFmt(result.total)}</strong></td></tr>
          </tbody>
        </table>
        <p><strong>Formula:</strong> {result.formula}</p>
        <p><strong>Court fee:</strong> {result.courtFeeNote}</p>
        <p><strong>Advocate:</strong> {result.advocateNote}</p>
        <p><strong>Wages:</strong> {result.wageNote}</p>
        <p><strong>Court level:</strong> {result.courtLevelNote}</p>
        <p><strong>Methodology + confidence:</strong> {result.methodology} Confidence: {result.confidence} · n = {indianFmt(result.n)} pending · fetched {result.fetchedAt} · source {result.source}</p>
      </div>

      <div style={{ border: "1px solid #d8d8d8", borderRadius: 10, padding: 14 }}>
        <h3 style={{ marginTop: 0 }}>Cost vs suit value (time held at queue clearance)</h3>
        <Scatter points={scatter} />
        <p style={{ fontSize: 13 }}>Each dot: total planning cost if the suit value were that amount. Time (y-axis of the model) is the queue-clearance horizon — see methodology.</p>
      </div>

      <div style={{ border: "1px solid #d8d8d8", borderRadius: 10, padding: 14 }}>
        <h3 style={{ marginTop: 0 }}>Plain-language explainer ({explainer.via === "llm" ? "BharatCode Qwen 3.8 27B" : "template fallback — LLM busy/503"})</h3>
        <p style={{ whiteSpace: "pre-wrap" }}>{explainer.text}</p>
      </div>
    </section>
  );
}

function Card({ title, big, sub }: { title: string; big: string; sub: string }) {
  return (
    <div style={{ border: "1px solid #d8d8d8", borderRadius: 10, padding: 14 }}>
      <div style={{ fontSize: 13, color: "#555" }}>{title}</div>
      <div style={{ fontSize: 22, fontWeight: 700, margin: "6px 0" }}>{big}</div>
      <div style={{ fontSize: 13 }}>{sub}</div>
    </div>
  );
}

/** Dependency-free cost-vs-time scatter (SVG). */
function Scatter({ points }: { points: { suitValue: number; total: number; months: number }[] }) {
  const W = 640, H = 300, L = 70, B = 44, T = 16, R = 14;
  const xs = points.map((p) => p.suitValue);
  const ys = points.map((p) => p.total);
  const xMin = Math.min(...xs), xMax = Math.max(...xs);
  const yMin = 0, yMax = Math.max(...ys) * 1.1 || 1;
  const sx = (x: number) => L + ((x - xMin) / (xMax - xMin)) * (W - L - R);
  const sy = (y: number) => H - B - ((y - yMin) / (yMax - yMin)) * (H - T - B);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Cost vs suit value scatter" style={{ width: "100%", maxWidth: 640 }}>
      <line x1={L} y1={T} x2={L} y2={H - B} stroke="#888" />
      <line x1={L} y1={H - B} x2={W - R} y2={H - B} stroke="#888" />
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <g key={f}>
          <line x1={L} y1={sy((yMax * f) / 1.1)} x2={W - R} y2={sy((yMax * f) / 1.1)} stroke="#eee" />
          <text x={L - 8} y={sy((yMax * f) / 1.1) + 4} textAnchor="end" fontSize="11">₹{Math.round((yMax * f) / 1000)}k</text>
        </g>
      ))}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={sx(p.suitValue)} cy={sy(p.total)} r="6" fill="#06293d" />
          <title>{`₹${indianFmt(p.suitValue)} → ₹${indianFmt(p.total)}`}</title>
        </g>
      ))}
      <text x={W / 2 - 40} y={H - 8} fontSize="12">suit value (₹)</text>
      <text x={14} y={H / 2} fontSize="12" transform={`rotate(-90 14 ${H / 2})`}>total cost (₹)</text>
    </svg>
  );
}

const tbl: React.CSSProperties = { borderCollapse: "collapse", width: "100%", maxWidth: 520 };
