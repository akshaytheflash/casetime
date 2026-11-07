import type { EstimateResult } from "../lib/estimator";
import { inr } from "../lib/format";
import { LEGAL_AID_META } from "../lib/legalAid";

export default function LegalAidPanel({ result }: { result: EstimateResult }) {
  const aid = result.legalAid;
  const eligible = aid.eligible;

  return (
    <section className="aid-section" aria-labelledby="aid-heading">
      <div className="shell aid-grid">
        <div>
          <p className="hero-kicker" style={{ marginBottom: 10 }}>
            Section 12, Legal Services Authorities Act, 1987
          </p>
          <h2
            className={`aid-status ${eligible ? "eligible" : ""}`}
            id="aid-heading"
            aria-live="polite"
          >
            {eligible
              ? "You may qualify for free legal aid."
              : aid.status === "not-eligible"
                ? "Not eligible on the income you entered."
                : "Legal-aid eligibility not assessed."}
          </h2>
          <p className="section-note" style={{ maxWidth: "56ch" }}>
            {aid.note}
          </p>

          {eligible && (
            <>
              <p className="aid-save">
                The advocate line drops by <strong>{inr(aid.advocateSaving)}</strong>.
              </p>
              {aid.matched.length > 0 && (
                <ul className="aid-list">
                  {aid.matched.map((m) => (
                    <li key={m.id}>
                      {m.label} <span className="cite">{m.cite}</span>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          {!eligible && aid.status !== "not-eligible" && (
            <ul className="aid-list">
              <li>Woman or child <span className="cite">s.12(c)</span> — no income test.</li>
              <li>Member of a Scheduled Caste or Scheduled Tribe <span className="cite">s.12(a)</span>.</li>
              <li>Person with disability <span className="cite">s.12(d)</span>.</li>
              <li>Industrial workman <span className="cite">s.12(f)</span>.</li>
            </ul>
          )}

          <div className="callout callout-sage" style={{ marginTop: 16 }}>
            <p>
              <strong>Court fee is separate.</strong> {aid.courtFeeNote}{" "}
              <a href={aid.order33Url} target="_blank" rel="noreferrer">
                Order XXXIII CPC
              </a>
              .
            </p>
          </div>

          <p className="section-note" style={{ marginTop: 12 }}>
            {aid.incomeLimit !== null
              ? `The ${result.legalAid.incomeLimitSource ? "State" : ""} income ceiling used here is ${inr(
                  aid.incomeLimit
                )} per year. ${aid.incomeLimitSource}`
              : "No income ceiling is stored for this State. Ask the DLSA for the current figure."}
          </p>
        </div>

        <div className="aid-card" style={{ borderTopColor: "var(--sage-ink)" }}>
          <h3 className="h3">Where to apply</h3>
          <p>{aid.authority.name}</p>
          <p>{aid.authority.note}</p>
          <div className="aid-actions">
            <a className="btn" href={aid.authority.url} target="_blank" rel="noreferrer">
              Find your DLSA
            </a>
            <a
              className="btn btn-secondary"
              href={aid.applyUrl}
              target="_blank"
              rel="noreferrer"
            >
              Apply through NALSA
            </a>
          </div>
          <p className="section-note" style={{ marginTop: 12 }}>
            Carry proof of the category and, if income is the route, an affidavit. The Authority
            decides whether there is a prima facie case. {LEGAL_AID_META.note}
          </p>
          <p className="section-note" style={{ marginTop: 8 }}>
            <a href={LEGAL_AID_META.textUrl} target="_blank" rel="noreferrer">
              Read the Act text
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
