import type { EstimateResult } from "../lib/estimator";
import type { Alternative } from "../lib/alternatives";
import { inr } from "../lib/format";

function sortAlternatives(list: Alternative[]): Alternative[] {
  return [...list].sort((a, b) => {
    if (a.recommended !== b.recommended) return a.recommended ? -1 : 1;
    if (a.available !== b.available) return a.available ? -1 : 1;
    return 0;
  });
}

export default function AlternativesSection({ result }: { result: EstimateResult }) {
  const rows = sortAlternatives(result.alternatives);

  return (
    <section className="shell" style={{ paddingTop: 48, paddingBottom: 48 }} aria-labelledby="alt-heading">
      <div className="section-head">
        <div>
          <h2 className="h2" id="alt-heading">
            Where to go instead
          </h2>
          <p className="section-note">
            Four statutory routes out of the queue. The right one depends on facts a template cannot
            see; use this table to ask a legal-aid lawyer the right question.
          </p>
        </div>
      </div>

      <div className="alt-list">
        {rows.map((a) => (
          <article
            className={`alt-row ${a.recommended ? "recommended" : ""} ${!a.available ? "unavailable" : ""}`}
            key={a.id}
          >
            <div>
              <h3 className="alt-name">
                {a.name}
                {a.recommended && <span className="tag">Recommended for this case</span>}
                {!a.available && <span className="tag tag-cost">Not available</span>}
              </h3>
            </div>
            <div className="alt-basis">
              {a.basis}{" "}
              <a href={a.basisUrl} target="_blank" rel="noreferrer">
                Act text
              </a>
            </div>
            <div className="alt-time">
              <strong>{a.time}</strong>
              <br />
              <span className="section-note" style={{ margin: 0, display: "block" }}>
                {a.timeBasis}
              </span>
            </div>
            <div className="alt-cost">
              <strong>{a.costAmount === null ? "Fee not fixed" : inr(a.costAmount)}</strong>
              <br />
              {a.cost}
              <br />
              <span className="section-note" style={{ margin: 0, display: "block" }}>
                {a.costNote}
              </span>
            </div>
            <div className="alt-link">
              <a href={a.link} target="_blank" rel="noreferrer">
                {a.linkLabel}
              </a>
            </div>
            {!a.available && a.unavailableReason && (
              <p className="alt-reason">{a.unavailableReason}</p>
            )}
          </article>
        ))}
      </div>

      <p className="section-note" style={{ marginTop: 16 }}>
        A Lok Adalat cannot take a non-compoundable offence. A mediated settlement is enforceable as
        a decree (Mediation Act, 2023, s.27; Lok Adalat award, LSA 1987, s.21). The s.12A route is
        mandatory for a commercial suit that does not contemplate urgent interim relief. None of this
        is a recommendation for your specific case.
      </p>
    </section>
  );
}
