"use client";

import type { EstimateResult } from "../lib/estimator";
import type { MessageKey } from "../lib/i18n/messages/en";
import { inr } from "../lib/format";
import { AID_CATEGORY_KEY, LEGAL_AID_META } from "../lib/legalAid";
import { useI18n } from "./I18nProvider";

const AUTHORITY_NOTE_KEY: Record<string, MessageKey> = {
  "Delhi State Legal Services Authority (DSLSA)": "aid.authority.delhi",
  "Maharashtra State Legal Services Authority (MSLSA)": "aid.authority.maharashtra",
  "Karnataka State Legal Services Authority (KSLSA)": "aid.authority.karnataka",
  "Tamil Nadu State Legal Services Authority (TNSLSA)": "aid.authority.tamilNadu",
  "National Legal Services Authority (NALSA)": "aid.authority.nalsa",
};

export default function LegalAidPanel({
  result,
  state,
}: {
  result: EstimateResult;
  state?: string;
}) {
  const { t } = useI18n();
  const aid = result.legalAid;
  const eligible = aid.eligible;

  const note = eligible
    ? t("aid.note.eligible")
    : aid.status === "not-eligible"
      ? t("aid.note.notEligible", {
          state: state ?? "",
          limit: aid.incomeLimit !== null ? inr(aid.incomeLimit) : "",
        })
      : t("aid.note.unknown");

  const authorityNoteKey = AUTHORITY_NOTE_KEY[aid.authority.name];

  return (
    <section className="aid-section" aria-labelledby="aid-heading">
      <div className="shell aid-grid">
        <div>
          <p className="hero-kicker" style={{ marginBottom: 10 }}>
            {t("aid.kicker")}
          </p>
          <h2
            className={`aid-status ${eligible ? "eligible" : ""}`}
            id="aid-heading"
            aria-live="polite"
          >
            {eligible
              ? t("aid.eligible")
              : aid.status === "not-eligible"
                ? t("aid.notEligible")
                : t("aid.unknown")}
          </h2>
          <p className="section-note" style={{ maxWidth: "56ch" }}>
            {note}
          </p>

          {eligible && (
            <>
              <p className="aid-save">
                {t("aid.saving", { amount: inr(aid.advocateSaving) })}
              </p>
              {aid.matched.length > 0 && (
                <ul className="aid-list">
                  {aid.matched.map((m) => (
                    <li key={m.id}>
                      {m.id === "income"
                        ? t("aid.matched.income", {
                            state: state ?? "",
                            amount: inr(aid.incomeLimit ?? 0),
                          })
                        : AID_CATEGORY_KEY[m.id]
                          ? t(AID_CATEGORY_KEY[m.id])
                          : m.label}{" "}
                      <span className="cite">{m.cite}</span>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          {!eligible && aid.status !== "not-eligible" && (
            <ul className="aid-list">
              <li>
                {t("aid.list.woman")} <span className="cite">s.12(c)</span>.
              </li>
              <li>
                {t("aid.list.scst")} <span className="cite">s.12(a)</span>.
              </li>
              <li>
                {t("aid.list.disability")} <span className="cite">s.12(d)</span>.
              </li>
              <li>
                {t("aid.list.workman")} <span className="cite">s.12(f)</span>.
              </li>
            </ul>
          )}

          <div className="callout callout-sage" style={{ marginTop: 16 }}>
            <p>
              <strong>{t("aid.courtFeeTitle")}</strong> {t("aid.courtFeeNote")}{" "}
              <a href={aid.order33Url} target="_blank" rel="noreferrer">
                {t("aid.order33")}
              </a>
              .
            </p>
          </div>

          <p className="section-note" style={{ marginTop: 12 }}>
            {aid.incomeLimit !== null
              ? t("aid.incomeCeilingWithSource", {
                  amount: inr(aid.incomeLimit),
                  source: aid.incomeLimitSource,
                })
              : t("aid.noIncome")}
          </p>
        </div>

        <div className="aid-card" style={{ borderTopColor: "var(--sage-ink)" }}>
          <h3 className="h3">{t("aid.whereApply")}</h3>
          <p>{aid.authority.name}</p>
          <p>{authorityNoteKey ? t(authorityNoteKey) : aid.authority.note}</p>
          <div className="aid-actions">
            <a className="btn" href={aid.authority.url} target="_blank" rel="noreferrer">
              {t("aid.findDlsa")}
            </a>
            <a className="btn btn-secondary" href={aid.applyUrl} target="_blank" rel="noreferrer">
              {t("aid.applyNalsa")}
            </a>
          </div>
          <p className="section-note" style={{ marginTop: 12 }}>
            {t("aid.carry", { note: t("aid.legalAidMetaNote") })}
          </p>
          <p className="section-note" style={{ marginTop: 8 }}>
            <a href={LEGAL_AID_META.textUrl} target="_blank" rel="noreferrer">
              {t("common.readAct")}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
