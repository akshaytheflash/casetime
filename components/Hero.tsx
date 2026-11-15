"use client";

import type { EstimateInput } from "../lib/types";
import { CASE_TYPE_LABEL_KEY } from "../lib/types";
import type { EstimateResult } from "../lib/estimator";
import type { MessageKey } from "../lib/i18n/messages/en";
import { inrShort, months, num } from "../lib/format";
import { useI18n } from "./I18nProvider";
import TimeCostBand from "./TimeCostBand";
import type { NjdgStatus } from "./Masthead";

const HEADLINE_KEY: Record<EstimateInput["caseType"], MessageKey> = {
  family: "hero.kind.family",
  property: "hero.kind.property",
  money: "hero.kind.money",
  commercial: "hero.kind.commercial",
  consumer: "hero.kind.consumer",
  cheque: "hero.kind.cheque",
  criminal: "hero.kind.criminal",
};

export default function Hero({
  result,
  input,
  njdg,
}: {
  result: EstimateResult | null;
  input: EstimateInput;
  njdg: NjdgStatus | null;
}) {
  const { t } = useI18n();
  const claim = inrShort(input.suitValue);
  const label = t(HEADLINE_KEY[input.caseType]);
  const stateLabel = input.state === "Other" ? t("hero.thisState") : input.state;

  const pending = njdg?.total ?? 52119188;

  return (
    <section className="hero shell" aria-labelledby="hero-heading">
      <p className="hero-kicker">{t("hero.kicker")}</p>
      {result ? (
        <>
          <p className="hero-statement">
            {result.referenceOnly
              ? t("hero.statementReference", {
                  claim,
                  kind: label,
                  state: stateLabel,
                  months: months(result.monthsUsed),
                })
              : t("hero.statement", {
                  claim,
                  kind: label,
                  state: stateLabel,
                  months: months(result.monthsUsed),
                })}{" "}
            {t("hero.waitCosts")}
          </p>
          <p className="hero-number" id="hero-heading" aria-live="polite">
            {inrShort(result.delayCost)}
            <span className="hero-number-of">
              {t("hero.outOf", { total: inrShort(result.total) })}
            </span>
          </p>
        </>
      ) : (
        <h1 className="hero-number" id="hero-heading">
          {t("hero.readingQueue")}
        </h1>
      )}
      <p className="hero-deck">{t("hero.deck")}</p>

      <p className="hero-context">
        {t("hero.context", { pending: num(pending) })}
      </p>

      <figure className="hero-figure">
        {result ? (
          <>
            <div className="figure-head">
              <div>
                <p className="figure-title">
                  {t("hero.figureTitle", {
                    caseType: t(CASE_TYPE_LABEL_KEY[input.caseType]),
                    state: stateLabel,
                    amount: inrShort(input.suitValue),
                  })}
                </p>
                <p className="figure-sub">{t("hero.figureSub")}</p>
              </div>
              <p className="figure-sub">
                {t("hero.totalAtEnd", { total: inrShort(result.total) })}
              </p>
            </div>
            <TimeCostBand result={result} input={input} />
          </>
        ) : (
          <p className="figure-sub">{t("hero.building")}</p>
        )}
      </figure>
    </section>
  );
}
