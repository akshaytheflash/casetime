"use client";

import type { EstimateInput } from "../lib/types";
import type { EstimateResult } from "../lib/estimator";
import type { MessageKey } from "../lib/i18n/messages/en";
import { inr, pct } from "../lib/format";
import { RBI, WAGE_SOURCE } from "../lib/fees";
import { useI18n } from "./I18nProvider";

const FORMULA_LABEL_KEY: Record<string, MessageKey> = {
  "Queue clearance": "ledger.formula.queue",
  "Hearings counted": "ledger.formula.hearings",
  "Court fee": "ledger.formula.courtFee",
  Advocate: "ledger.formula.advocate",
  "Lost wages": "ledger.formula.wages",
  "Cost of money": "ledger.formula.money",
  Total: "ledger.formula.total",
};

const FORMULA_SOURCE_KEY: Record<string, MessageKey> = {
  "NJDG, dated snapshot": "ledger.formula.source.njdg",
  "Your input; NJDG does not publish hearings per case":
    "ledger.formula.source.hearings",
  "No source for this State": "ledger.formula.source.noState",
  "s.12, Legal Services Authorities Act, 1987": "ledger.formula.source.legalAid",
  "Your quote; ₹9,000 default is the DSLSA panel rate":
    "ledger.formula.source.quote",
  "State notified wage": "ledger.formula.source.stateWage",
  "VB-G RAM G national average": "ledger.formula.source.nationalWage",
  "RBI repo rate, 7 Oct 2026": "ledger.formula.source.rbi",
  "Excludes court fee (not yet sourced)": "ledger.formula.source.excludesFee",
  "Sum of the lines above": "ledger.formula.source.sum",
  "Set to ₹0 — legal aid": "ledger.formula.source.zeroAid",
};

export default function CostLedger({
  result,
  input,
}: {
  result: EstimateResult;
  input?: EstimateInput;
}) {
  const { t } = useI18n();
  const courtFeeNote =
    input?.caseType === "cheque"
      ? t("ledger.courtFeeNoteCheque", {
          state: input.state === "Other" ? t("hero.thisState") : input.state,
        })
      : t("ledger.courtFeeNoteState");

  return (
    <div>
      {result.totalExcludesCourtFee && (
        <div className="callout callout-cost">
          <p>
            <strong>{t("ledger.courtFeeMissingTitle")}</strong> {courtFeeNote}
          </p>
        </div>
      )}

      <table className="ledger">
        <thead>
          <tr>
            <th scope="col">{t("ledger.line")}</th>
            <th scope="col" className="amount">
              {t("ledger.amount")}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <span className="line-name">{t("ledger.courtFee")}</span>
              <span className="line-basis">
                {result.courtFee === null
                  ? t("ledger.courtFeeBasisUnavailable")
                  : `${result.courtFeeSection} · ${result.courtFeeAct}`}
              </span>
              {result.courtFeeUrl && (
                <a className="line-source" href={result.courtFeeUrl} target="_blank" rel="noreferrer">
                  {t("ledger.openAct")}
                </a>
              )}
            </td>
            <td className="amount">
              {result.courtFee === null ? (
                <span className="tag tag-cost">{t("common.notYetSourced")}</span>
              ) : (
                inr(result.courtFee)
              )}
            </td>
          </tr>

          <tr>
            <td>
              <span className="line-name">
                {t("ledger.advocate")}{" "}
                {result.advocateWaived && (
                  <span className="tag tag-sage">{t("common.legalAid")}</span>
                )}
              </span>
              <span className="line-basis">
                {result.advocateWaived ? (
                  t("ledger.waived", { amount: inr(result.advocateRaw) })
                ) : (
                  t("ledger.advocateBasis", {
                    amount: inr(result.advocateRaw / Math.max(result.hearings, 1)),
                    hearings: result.hearings,
                  })
                )}
              </span>
              {!result.advocateWaived && (
                <a
                  className="line-source"
                  href="https://cdnbbsr.s3waas.gov.in/s395b7a6d9a47c56ff9118bb45379fc884/uploads/2025/08/202508011960783529.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  {t("ledger.dslsa")}
                </a>
              )}
            </td>
            <td className="amount">
              {result.advocateWaived ? <span className="zero">₹0</span> : inr(result.advocateTotal)}
            </td>
          </tr>

          <tr>
            <td>
              <span className="line-name">{t("ledger.lostWages")}</span>
              <span className="line-basis">
                {t("ledger.lostWagesBasis", {
                  hearings: result.hearings,
                  perHearing: inr(result.opportunityCost / Math.max(result.hearings, 1)),
                })}
              </span>
              <a className="line-source" href={WAGE_SOURCE.url} target="_blank" rel="noreferrer">
                {t("ledger.wageNotification")}
              </a>
            </td>
            <td className="amount">{inr(result.opportunityCost)}</td>
          </tr>

          <tr>
            <td>
              <span className="line-name">{t("ledger.costOfMoney")}</span>
              <span className="line-basis">{t("ledger.costOfMoneyBasis")}</span>
              <a className="line-source" href={RBI.url} target="_blank" rel="noreferrer">
                {t("ledger.rbi")}
              </a>
            </td>
            <td className="amount">{inr(result.interest)}</td>
          </tr>

          <tr className="subtotal">
            <td>{t("ledger.litigationCost")}</td>
            <td className="amount">{inr(result.litigationCost)}</td>
          </tr>
          <tr className="subtotal">
            <td>{t("ledger.waitingCost")}</td>
            <td className="amount">{inr(result.delayCost)}</td>
          </tr>
          <tr className="total">
            <td>{t("ledger.total")}</td>
            <td className="amount">{inr(result.total)}</td>
          </tr>
        </tbody>
      </table>

      <div className="metric-row">
        <div>
          <dt>{t("ledger.perMonth")}</dt>
          <dd>{inr(result.perMonth)}</dd>
        </div>
        <div>
          <dt>{t("ledger.share")}</dt>
          <dd>{pct(result.shareOfClaim)}</dd>
        </div>
        <div>
          <dt>{t("ledger.hearings")}</dt>
          <dd>{result.hearings}</dd>
        </div>
      </div>

      <p className="section-note">
        {t("ledger.note", {
          hearings: result.hearings,
          rate:
            result.hearings > 0
              ? (result.hearings / Math.max(result.monthsUsed, 1)).toFixed(2)
              : "0",
        })}
      </p>

      <details>
        <summary>
          <span>{t("ledger.howComputed")}</span>
          <span className="summary-open" aria-hidden="true">
            {t("common.open")}
          </span>
          <span className="summary-close" aria-hidden="true">
            {t("common.close")}
          </span>
        </summary>
        <div className="details-body">
          <ul className="formula-list">
            {result.formulas.map((f) => (
              <li key={f.label}>
                <span className="f-label">
                  {FORMULA_LABEL_KEY[f.label] ? t(FORMULA_LABEL_KEY[f.label]) : f.label}
                </span>
                <span className="f-expr">{f.expression}</span>
                <span className="f-value">
                  {f.value === "Not yet sourced" ? t("common.notYetSourced") : f.value}
                </span>
                <span className="f-source">
                  {FORMULA_SOURCE_KEY[f.source] ? t(FORMULA_SOURCE_KEY[f.source]) : f.source}
                </span>
              </li>
            ))}
          </ul>
          <p className="section-note" style={{ marginTop: 10 }}>
            {t("ledger.limitation")}
          </p>
        </div>
      </details>
    </div>
  );
}
