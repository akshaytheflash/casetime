import type { EstimateResult } from "../lib/estimator";
import { inr, pct } from "../lib/format";
import { RBI, WAGE_SOURCE } from "../lib/fees";

export default function CostLedger({ result }: { result: EstimateResult }) {
  return (
    <div>
      {result.totalExcludesCourtFee && (
        <div className="callout callout-cost">
          <p>
            <strong>The court fee is not in this total.</strong> {result.courtFeeNote}
          </p>
        </div>
      )}

      <table className="ledger">
        <thead>
          <tr>
            <th scope="col">Line</th>
            <th scope="col" className="amount">
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <span className="line-name">Court fee</span>
              <span className="line-basis">
                {result.courtFee === null
                  ? "Not yet sourced for this State or forum"
                  : `${result.courtFeeSection} · ${result.courtFeeAct}`}
              </span>
              {result.courtFeeUrl && (
                <a className="line-source" href={result.courtFeeUrl} target="_blank" rel="noreferrer">
                  Open the Act text
                </a>
              )}
            </td>
            <td className="amount">
              {result.courtFee === null ? (
                <span className="tag tag-cost">Not yet sourced</span>
              ) : (
                inr(result.courtFee)
              )}
            </td>
          </tr>

          <tr>
            <td>
              <span className="line-name">
                Advocate{" "}
                {result.advocateWaived && <span className="tag tag-sage">Legal aid</span>}
              </span>
              <span className="line-basis">
                {result.advocateWaived ? (
                  <>
                    <span className="waived">{inr(result.advocateRaw)}</span> set to ₹0 under s.12,
                    Legal Services Authorities Act, 1987
                  </>
                ) : (
                  result.advocateNote
                )}
              </span>
              {!result.advocateWaived && (
                <a
                  className="line-source"
                  href="https://cdnbbsr.s3waas.gov.in/s395b7a6d9a47c56ff9118bb45379fc884/uploads/2025/08/202508011960783529.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  DSLSA panel-fee schedule
                </a>
              )}
            </td>
            <td className="amount">
              {result.advocateWaived ? <span className="zero">₹0</span> : inr(result.advocateTotal)}
            </td>
          </tr>

          <tr>
            <td>
              <span className="line-name">Lost wages</span>
              <span className="line-basis">
                {result.hearings} hearings ×{" "}
                {inr(result.opportunityCost / Math.max(result.hearings, 1))} lost per hearing.
              </span>
              <a className="line-source" href={WAGE_SOURCE.url} target="_blank" rel="noreferrer">
                VB-G RAM G wage notification
              </a>
            </td>
            <td className="amount">{inr(result.opportunityCost)}</td>
          </tr>

          <tr>
            <td>
              <span className="line-name">Cost of money</span>
              <span className="line-basis">
                Claim × RBI repo rate × time. The rate is a risk-free lower bound, not the interest a
                court may award.
              </span>
              <a className="line-source" href={RBI.url} target="_blank" rel="noreferrer">
                RBI Monetary Policy Statement, 7 Oct 2026
              </a>
            </td>
            <td className="amount">{inr(result.interest)}</td>
          </tr>

          <tr className="subtotal">
            <td>Litigation cost (fee + advocate)</td>
            <td className="amount">{inr(result.litigationCost)}</td>
          </tr>
          <tr className="subtotal">
            <td>Cost of waiting (wages + money)</td>
            <td className="amount">{inr(result.delayCost)}</td>
          </tr>
          <tr className="total">
            <td>Total planning cost</td>
            <td className="amount">{inr(result.total)}</td>
          </tr>
        </tbody>
      </table>

      <div className="metric-row">
        <div>
          <dt>Per month in the queue</dt>
          <dd>{inr(result.perMonth)}</dd>
        </div>
        <div>
          <dt>Share of the claim</dt>
          <dd>{pct(result.shareOfClaim)}</dd>
        </div>
        <div>
          <dt>Hearings counted</dt>
          <dd>{result.hearings}</dd>
        </div>
      </div>

      <p className="section-note">
        The total is a planning estimate, not a quote. It uses {result.hearings} hearings at{" "}
        {result.hearings > 0 ? (result.hearings / Math.max(result.monthsUsed, 1)).toFixed(2) : "0"}{" "}
        per month and the inputs you entered. Change any input and rebuild the statement.
      </p>

      <details>
        <summary>How each line is computed</summary>
        <div className="details-body">
          <ul className="formula-list">
            {result.formulas.map((f) => (
              <li key={f.label}>
                <span className="f-label">{f.label}</span>
                <span className="f-expr">{f.expression}</span>
                <span className="f-value">{f.value}</span>
                <span className="f-source">{f.source}</span>
              </li>
            ))}
          </ul>
          <p className="section-note" style={{ marginTop: 10 }}>
            {result.limitation}
          </p>
        </div>
      </details>
    </div>
  );
}
