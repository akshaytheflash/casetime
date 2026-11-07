import type { EstimateInput } from "../lib/types";
import type { EstimateResult } from "../lib/estimator";
import { inr, inrShort, months, yearsMonths, num, pct } from "../lib/format";

export default function TimeCostBand({
  result,
  input,
}: {
  result: EstimateResult;
  input: EstimateInput;
}) {
  const totalMonths = Math.max(1, result.monthsUsed);
  const step = totalMonths > 72 ? 2 : 1;
  const count = Math.floor(totalMonths / step) + 1;
  const maxTotal = Math.max(result.total, 1);

  const cols = Array.from({ length: count }, (_, i) => {
    const m = Math.min(totalMonths, i * step);
    const hearingsAt = Math.min(
      result.hearings,
      Math.round(m * input.hearingsPerMonth)
    );
    const hearingFrac = result.hearings > 0 ? hearingsAt / result.hearings : 0;
    const lit = (result.courtFee ?? 0) + result.advocateTotal * hearingFrac;
    const delay =
      result.opportunityCost * hearingFrac +
      result.interest * (totalMonths > 0 ? m / totalMonths : 0);
    return { m, lit, delay, total: lit + delay };
  });

  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => ({
    f,
    m: Math.round(totalMonths * f),
  }));

  const summary = `Time-cost band for ${months(result.monthsUsed)}. The total is ${inr(
    result.total
  )}, of which ${inr(result.delayCost)} is the cost of waiting.`;

  return (
    <figure className="band" aria-label={summary}>
      <div className="band-plot" role="img" aria-label={summary}>
        <span className="band-case" aria-hidden="true" />
        <span className="band-case-label" aria-hidden="true">
          you file
        </span>
        {cols.map((c) => {
          const totalAt = c.total;
          const litPct = totalAt > 0 ? (c.lit / totalAt) * 100 : 0;
          const delayPct = totalAt > 0 ? (c.delay / totalAt) * 100 : 0;
          const heightPct = (totalAt / maxTotal) * 100;
          return (
            <div
              className="band-col"
              key={c.m}
              title={`Month ${c.m}: ${inr(c.total)} (${inr(c.lit)} litigation + ${inr(
                c.delay
              )} delay)`}
            >
              <div style={{ height: `${heightPct}%`, width: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                <div className="band-delay" style={{ height: `${delayPct}%` }} />
                <div className="band-lit" style={{ height: `${litPct}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="band-axis" aria-hidden="true">
        {ticks.map((t, i) => (
          <span
            key={t.f}
            className={`band-tick ${i === 0 ? "start" : ""} ${i === ticks.length - 1 ? "end" : ""} ${
              i === 1 || i === 3 ? "tick-mid" : ""
            }`}
            style={
              i === 0
                ? undefined
                : i === ticks.length - 1
                  ? undefined
                  : { left: `${t.f * 100}%` }
            }
          >
            {i === 0 ? "file" : i === ticks.length - 1 ? "queue clears" : `${t.m} mo`}
          </span>
        ))}
      </div>

      <div className="band-legend">
        <span>
          <i className="swatch lit" aria-hidden="true" /> Court fee and appearances
        </span>
        <span>
          <i className="swatch delay" aria-hidden="true" /> Lost wages and the money locked up
        </span>
        <span style={{ marginLeft: "auto", color: "var(--ink)" }}>
          <strong style={{ fontVariantNumeric: "tabular-nums" }}>{inrShort(result.total)}</strong> at
          the end of the queue
        </span>
      </div>

      <figcaption className="band-caption">
        Each column is a month of the queue. The blue block is the court fee plus the appearances you
        fund; the red block is the wage you lose and the cost of money tied up in the claim. The dot
        is the day you file. Hover or focus a column for the running total.
      </figcaption>

      <div className="pool-row">
        <span>
          Age of cases still pending, not disposal time: <strong>P50 {yearsMonths(result.pool.p50 * 12)}</strong>
        </span>
        <span>
          <strong>P75 {yearsMonths(result.pool.p75 * 12)}</strong>
        </span>
        <span>
          <strong>P90 {yearsMonths(result.pool.p90 * 12)}</strong>
        </span>
        <span>
          The stock that feeds those figures, by age, so you can see why they are not disposal times:
        </span>
      </div>

      <table className="band-table">
        <caption className="sr-only-note">
          NJDG age bands for pending cases. Survivorship bias: cases that finish early leave the
          pool, so the share still waiting after ten years is not the share that took ten years.
        </caption>
        <thead>
          <tr>
            <th scope="col">Age at the count</th>
            <th scope="col">Cases still pending</th>
            <th scope="col">Share</th>
          </tr>
        </thead>
        <tbody>
          {result.poolBands.map((b) => (
            <tr key={b.label}>
              <th scope="row">{b.label}</th>
              <td>{num(b.count)}</td>
              <td>{pct(b.share, 1)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="pool-legend">
        Read it as the age of the waiting room, not the length of the stay: a case finished in eight
        months never appears in the “5–10 years” band, so that band cannot tell you what eight months
        looked like. These counts never enter the cost calculation — the money figures use the queue
        horizon above.
      </p>

      {result.referenceOnly && (
        <div className="callout callout-cost" style={{ marginTop: 14 }}>
          <p>
            <strong>Reference only.</strong>{" "}
            {result.forum === "consumer"
              ? "NJDG covers district civil courts, not Consumer Commissions. The queue above is the civil-court reference; no consumer-commission disposal series is published in NJDG."
              : "NJDG's criminal pendency covers all criminal cases, not s.138 complaints specifically. The queue above is a broad criminal-court reference."}
          </p>
        </div>
      )}
    </figure>
  );
}
