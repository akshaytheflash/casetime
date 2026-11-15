"use client";

import type { EstimateInput } from "../lib/types";
import type { EstimateResult } from "../lib/estimator";
import type { Alternative } from "../lib/alternatives";
import type { MessageKey } from "../lib/i18n/messages/en";
import { inr } from "../lib/format";
import { useI18n } from "./I18nProvider";

const ALT_NAME_KEY: Record<string, MessageKey> = {
  "lok-adalat": "alt.name.lok-adalat",
  pims: "alt.name.pims",
  mediation: "alt.name.mediation",
  compounding: "alt.name.compounding",
};

const ALT_LINK_KEY: Record<string, MessageKey> = {
  "lok-adalat": "alt.link.lok-adalat",
  pims: "alt.link.pims",
  mediation: "alt.link.mediation",
  compounding: "alt.link.compounding",
};

const ALT_BASIS_KEY: Record<string, MessageKey> = {
  "lok-adalat": "alt.basis.lok-adalat",
  pims: "alt.basis.pims",
  mediation: "alt.basis.mediation",
  compounding: "alt.basis.compounding",
};

const ALT_TIME_KEY: Record<string, MessageKey> = {
  "lok-adalat": "alt.time.lok-adalat",
  pims: "alt.time.pims",
  mediation: "alt.time.mediation",
  compounding: "alt.time.compounding",
};

const ALT_TIME_BASIS_KEY: Record<string, MessageKey> = {
  "lok-adalat": "alt.timeBasis.lok-adalat",
  pims: "alt.timeBasis.pims",
  mediation: "alt.timeBasis.mediation",
  compounding: "alt.timeBasis.compounding",
};

function sortAlternatives(list: Alternative[]): Alternative[] {
  return [...list].sort((a, b) => {
    if (a.recommended !== b.recommended) return a.recommended ? -1 : 1;
    if (a.available !== b.available) return a.available ? -1 : 1;
    return 0;
  });
}

export default function AlternativesSection({
  result,
  input,
}: {
  result: EstimateResult;
  input: EstimateInput;
}) {
  const { t } = useI18n();
  const rows = sortAlternatives(result.alternatives);
  const aidEligible = result.legalAid.eligible;

  const cost = (a: Alternative): string => {
    if (a.id === "pims") {
      if (a.costAmount === null) return t("alt.cost.pimsUnavailable");
      const share = a.costAmount - 1000;
      return t("alt.cost.pims", {
        share: inr(share),
        total: inr(share * 2),
        applicant: inr(a.costAmount),
      });
    }
    if (a.id === "mediation") {
      return aidEligible ? t("alt.cost.mediationAid") : t("alt.cost.mediationPaid");
    }
    if (a.id === "compounding") return t("alt.cost.compounding");
    return t("alt.cost.lok-adalat");
  };

  const costNote = (a: Alternative): string => {
    if (a.id === "mediation") {
      return aidEligible
        ? t("alt.costNote.mediationAid")
        : t("alt.costNote.mediationPaid");
    }
    if (a.id === "compounding") return t("alt.costNote.compounding");
    return aidEligible
      ? t("alt.costNote.advocateFree")
      : t("alt.costNote.advocatePaid", { amount: inr(input.advocatePerAppearance) });
  };

  const reason = (a: Alternative): string | null => {
    if (a.available || !a.unavailableReason) return null;
    if (a.id === "pims") {
      return input.caseType === "commercial"
        ? t("alt.reason.pimsBelow")
        : t("alt.reason.pimsNotCommercial");
    }
    if (a.id === "mediation") return t("alt.reason.mediation");
    if (a.id === "compounding") return t("alt.reason.compounding");
    return t("alt.reason.lok-adalat");
  };

  return (
    <section className="shell" style={{ paddingTop: 48, paddingBottom: 48 }} aria-labelledby="alt-heading">
      <div className="section-head">
        <div>
          <h2 className="h2" id="alt-heading">
            {t("alt.heading")}
          </h2>
          <p className="section-note">{t("alt.intro")}</p>
        </div>
      </div>

      <div className="alt-list">
        {rows.map((a) => {
          const unavailableReason = reason(a);
          return (
            <article
              className={`alt-row ${a.recommended ? "recommended" : ""} ${!a.available ? "unavailable" : ""}`}
              key={a.id}
            >
              <div>
                <h3 className="alt-name">
                  {ALT_NAME_KEY[a.id] ? t(ALT_NAME_KEY[a.id]) : a.name}
                  {a.recommended && <span className="tag">{t("alt.recommended")}</span>}
                  {!a.available && <span className="tag tag-cost">{t("alt.unavailable")}</span>}
                </h3>
              </div>
              <div className="alt-basis">
                {ALT_BASIS_KEY[a.id] ? t(ALT_BASIS_KEY[a.id]) : a.basis}{" "}
                <a href={a.basisUrl} target="_blank" rel="noreferrer">
                  {t("common.actText")}
                </a>
              </div>
              <div className="alt-time">
                <strong>{t(ALT_TIME_KEY[a.id])}</strong>
                <br />
                <span className="section-note" style={{ margin: 0, display: "block" }}>
                  {t(ALT_TIME_BASIS_KEY[a.id])}
                </span>
              </div>
              <div className="alt-cost">
                <strong>{a.costAmount === null ? t("alt.feeNotFixed") : inr(a.costAmount)}</strong>
                <br />
                {cost(a)}
                <br />
                <span className="section-note" style={{ margin: 0, display: "block" }}>
                  {costNote(a)}
                </span>
              </div>
              <div className="alt-link">
                <a href={a.link} target="_blank" rel="noreferrer">
                  {ALT_LINK_KEY[a.id] ? t(ALT_LINK_KEY[a.id]) : a.linkLabel}
                </a>
              </div>
              {!a.available && unavailableReason && (
                <p className="alt-reason">{unavailableReason}</p>
              )}
            </article>
          );
        })}
      </div>

      <p className="section-note" style={{ marginTop: 16 }}>
        {t("alt.footnote")}
      </p>
    </section>
  );
}
