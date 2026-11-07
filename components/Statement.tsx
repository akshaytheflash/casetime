import type { EstimateInput } from "../lib/types";
import { CASE_TYPE_LABEL } from "../lib/types";
import type { EstimateResult } from "../lib/estimator";
import { inr, months, pct, yearsMonths } from "../lib/format";
import { placesForState } from "../lib/places";
import type { GeneratedNotice } from "../lib/notice";

type Places = ReturnType<typeof placesForState>;

export default function Statement({
  input,
  result,
  places,
  notice,
}: {
  input: EstimateInput;
  result: EstimateResult;
  places: Places;
  notice: GeneratedNotice;
}) {
  const date = new Date(result.generatedAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const topAlternatives = [...result.alternatives]
    .sort((a, b) => {
      if (a.recommended !== b.recommended) return a.recommended ? -1 : 1;
      if (a.available !== b.available) return a.available ? -1 : 1;
      return 0;
    })
    .slice(0, 3);

  return (
    <section className="statement-wrap" id="statement" aria-labelledby="statement-title">
      <div className="shell">
        <div className="statement-toolbar">
          <div>
            <h2 className="h2" style={{ fontSize: "1.35rem" }}>
              Case cost statement
            </h2>
            <p className="section-note" style={{ marginTop: 2 }}>
              One page, A4. Print or save as PDF.
            </p>
          </div>
          <button className="btn" type="button" onClick={() => window.print()}>
            Print / save as PDF
          </button>
        </div>

        <div className="statement-sheet">
          <div className="statement-head">
            <h1 className="statement-title" id="statement-title">
              Case cost statement
            </h1>
            <div className="statement-brand">
              CaseTime
              <br />
              Prepared {date}
            </div>
          </div>

          <dl className="statement-meta">
            <div>
              <dt>Case</dt>
              <dd>{CASE_TYPE_LABEL[input.caseType]}</dd>
            </div>
            <div>
              <dt>State / forum</dt>
              <dd>
                {input.state === "Other" ? "State not sourced" : input.state} · {result.forumLabel}
              </dd>
            </div>
            <div>
              <dt>Amount at stake</dt>
              <dd>{inr(input.suitValue)}</dd>
            </div>
            <div>
              <dt>Estimate basis</dt>
              <dd>{result.cohort ? "Disposed-case cohort" : "Queue-based lower bound"}</dd>
            </div>
          </dl>

          <div className="statement-section">
            <h3>Time to disposal</h3>
            <p>
              <strong>{months(result.monthsUsed)}</strong>{" "}
              {result.cohort
                ? `— median of ${result.cohort.n} disposed cases from the eCourtsIndia partner adapter.`
                : `— queue clearance at today's throughput (${result.derivation})`}
            </p>
            <p>
              <strong>Limitation:</strong> this is a queue-based lower bound, not a prediction for
              this case. NJDG publishes the age of cases still pending, not disposal durations; the
              age bands are shown as the age of the waiting stock, not as disposal times. A
              disposed-case cohort requires the partner key.{" "}
              {result.referenceOnly
                ? "The forum shown is not covered by NJDG; the queue is a reference, not a forum-specific estimate."
                : ""}
            </p>
            <p>
              Pending-pool age (not disposal time): P50 {yearsMonths(result.pool.p50 * 12)} · P75{" "}
              {yearsMonths(result.pool.p75 * 12)} · P90 {yearsMonths(result.pool.p90 * 12)}.{" "}
              {result.poolNote}
            </p>
          </div>

          <div className="statement-section">
            <h3>Cost of the case</h3>
            <table className="statement-table">
              <thead>
                <tr>
                  <th scope="col">Line</th>
                  <th scope="col">Basis</th>
                  <th scope="col" className="amount">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Court fee</td>
                  <td>
                    {result.courtFee === null
                      ? "Not yet sourced; excluded from the total"
                      : `${result.courtFeeSection}`}
                  </td>
                  <td className="amount">
                    {result.courtFee === null ? "—" : inr(result.courtFee)}
                  </td>
                </tr>
                <tr>
                  <td>Advocate</td>
                  <td>
                    {result.advocateWaived
                      ? "₹0 under s.12, Legal Services Authorities Act, 1987"
                      : `${inr(input.advocatePerAppearance)} × ${result.hearings} hearings`}
                  </td>
                  <td className="amount">
                    {result.advocateWaived ? "₹0" : inr(result.advocateTotal)}
                  </td>
                </tr>
                <tr>
                  <td>Lost wages</td>
                  <td>
                    {result.hearings} hearings × {inr(input.dailyWage)}/day × {input.daysPerHearing}{" "}
                    day(s)
                  </td>
                  <td className="amount">{inr(result.opportunityCost)}</td>
                </tr>
                <tr>
                  <td>Cost of money</td>
                  <td>
                    {inr(input.suitValue)} × {input.repoRate}% × {(result.monthsUsed / 12).toFixed(2)}{" "}
                    years (RBI repo rate, 7 Oct 2026)
                  </td>
                  <td className="amount">{inr(result.interest)}</td>
                </tr>
                <tr>
                  <td>Litigation cost</td>
                  <td>Court fee + advocate</td>
                  <td className="amount">{inr(result.litigationCost)}</td>
                </tr>
                <tr>
                  <td>Cost of waiting</td>
                  <td>Lost wages + cost of money</td>
                  <td className="amount">{inr(result.delayCost)}</td>
                </tr>
                <tr className="total">
                  <td>Total planning cost</td>
                  <td>{pct(result.shareOfClaim)} of the amount at stake</td>
                  <td className="amount">{inr(result.total)}</td>
                </tr>
              </tbody>
            </table>
            <p className="statement-small" style={{ marginTop: 4 }}>
              {result.totalExcludesCourtFee
                ? "The total excludes the court fee because no sourced schedule is stored for this State or forum."
                : "The total is a planning estimate, not a quote. The cost of money is a risk-free lower bound, not the interest a court may award."}
            </p>
          </div>

          <div className="statement-two">
            <div className="statement-section">
              <h3>Legal aid</h3>
              {result.legalAid.eligible ? (
                <>
                  <p>
                    <strong>May qualify under s.12.</strong> The advocate line is ₹0. The Authority
                    must still be satisfied there is a prima facie case (s.13(1)).
                  </p>
                  <p>
                    Matched:{" "}
                    {result.legalAid.matched.map((m) => `${m.label} (${m.cite})`).join("; ")}.
                  </p>
                  <p>
                    Apply: {result.legalAid.authority.name} — {result.legalAid.authority.url}
                  </p>
                </>
              ) : (
                <p>
                  Not eligible on the information entered ({result.legalAid.status}). A woman or
                  child qualifies under s.12(c) irrespective of income; other s.12 categories also
                  apply without an income test. Ask the DLSA: {result.legalAid.authority.name} —{" "}
                  {result.legalAid.authority.url}
                </p>
              )}
              <p>{result.legalAid.courtFeeNote}</p>
            </div>

            <div className="statement-section">
              <h3>Where to go instead</h3>
              <table className="statement-table">
                <thead>
                  <tr>
                    <th scope="col">Forum</th>
                    <th scope="col">Time</th>
                    <th scope="col" className="amount">
                      Cost
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topAlternatives.map((a) => (
                    <tr key={a.id}>
                      <td>
                        {a.name}
                        {a.recommended ? " (recommended)" : ""}
                      </td>
                      <td>{a.time}</td>
                      <td className="amount">
                        {a.costAmount === null ? "Fee not fixed" : inr(a.costAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="statement-two">
            <div className="statement-section">
              <h3>Nearest free help</h3>
              <p>
                <strong>{result.legalAid.authority.name}</strong> — {result.legalAid.authority.url}
              </p>
              <p>{result.legalAid.authority.note}</p>
              {places.places.slice(0, 2).map((p) => (
                <p key={p.id}>
                  {p.name} — {p.distanceKm.toFixed(1)} km from the {places.city} centre (OSM
                  snapshot). Call before you travel.
                </p>
              ))}
              <p className="statement-small">
                OSM snapshot {new Date(places.fetchedAt).toLocaleDateString("en-IN")}. Coordinates
                are copied from OpenStreetMap; no location is inferred.
              </p>
            </div>

            <div className="statement-section">
              <h3>Notice generated</h3>
              <p>
                <strong>{notice.title}</strong>
              </p>
              <p>
                The full draft is in the notice section of the app. Copy or download it, replace every
                bracketed field, and have a DLSA panel lawyer read it before sending.
              </p>
              <p className="statement-small">
                CaseTime is a planning estimate, not legal advice. Every rupee and every month in
                this statement traces to a source or shows its formula. Sources accessed 6 November
                2026.
              </p>
            </div>
          </div>

          <div className="statement-sources">
            <strong>Sources.</strong>{" "}
            {result.sources.map((s, i) => (
              <span key={s.label}>
                {i > 0 ? " · " : ""}
                {s.label}: {s.url}
              </span>
            ))}
            . NJDG data is the dated snapshot; the live dashboard is at https://njdg.ecourts.gov.in/.
          </div>
        </div>
      </div>
    </section>
  );
}
