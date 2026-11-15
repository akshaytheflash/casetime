"use client";

import type { EstimateInput } from "../lib/types";
import type { EstimateResult } from "../lib/estimator";
import type { MessageKey } from "../lib/i18n/messages/en";
import { inr, inrShort, months, yearsMonths, num, pct } from "../lib/format";
import { useI18n } from "./I18nProvider";

const AGE_BAND_KEY: Record<string, MessageKey> = {
  "<1 year": "band.age.lessThan1",
  "1-3 years": "band.age.1to3",
  "3-5 years": "band.age.3to5",
  "5-10 years": "band.age.5to10",
  ">10 years": "band.age.moreThan10",
};

export default function TimeCostBand({
  result,
  input,
}: {
  result: EstimateResult;
  input: EstimateInput;
}) {
  const { t } = useI18n();
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

  const summary = t("band.summary", {
    months: months(result.monthsUsed),
    total: inr(result.total),
    delay: inr(result.delayCost),
  });

  return (
    <figure className="band" aria-label={summary}>
      <div className="band-plot" role="img" aria-label={summary}>
        <span className="band-case" aria-hidden="true" />
        <span className="band-case-label" aria-hidden="true">
          {t("band.youFile")}
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
              title={t("band.monthTitle", {
                month: c.m,
                total: inr(c.total),
                litigation: inr(c.lit),
                delay: inr(c.delay),
              })}
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
        {ticks.map((tk, i) => (
          <span
            key={tk.f}
            className={`band-tick ${i === 0 ? "start" : ""} ${i === ticks.length - 1 ? "end" : ""} ${
              i === 1 || i === 3 ? "tick-mid" : ""
            }`}
            style={
              i === 0
                ? undefined
                : i === ticks.length - 1
                  ? undefined
                  : { left: `${tk.f * 100}%` }
            }
          >
            {i === 0
              ? t("band.file")
              : i === ticks.length - 1
                ? t("band.queueClears")
                : t("band.monthsShort", { months: tk.m })}
          </span>
        ))}
      </div>

      <div className="band-legend">
        <span>
          <i className="swatch lit" aria-hidden="true" /> {t("band.legendLit")}
        </span>
        <span>
          <i className="swatch delay" aria-hidden="true" /> {t("band.legendDelay")}
        </span>
        <span style={{ marginLeft: "auto", color: "var(--ink)" }}>
          {t("band.totalAtEnd", { total: inrShort(result.total) })}
        </span>
      </div>

      <figcaption className="band-caption">{t("band.caption")}</figcaption>

      <div className="pool-row">
        <span>
          {t("band.ageIntro")}{" "}
          <strong>{t("band.p50", { value: yearsMonths(result.pool.p50 * 12) })}</strong>
        </span>
        <span>
          <strong>{t("band.p75", { value: yearsMonths(result.pool.p75 * 12) })}</strong>
        </span>
        <span>
          <strong>{t("band.p90", { value: yearsMonths(result.pool.p90 * 12) })}</strong>
        </span>
        <span>{t("band.stock")}</span>
      </div>

      <table className="band-table">
        <caption className="sr-only-note">{t("band.tableCaption")}</caption>
        <thead>
          <tr>
            <th scope="col">{t("band.ageAtCount")}</th>
            <th scope="col">{t("band.casesPending")}</th>
            <th scope="col">{t("band.share")}</th>
          </tr>
        </thead>
        <tbody>
          {result.poolBands.map((b) => (
            <tr key={b.label}>
              <th scope="row">{AGE_BAND_KEY[b.label] ? t(AGE_BAND_KEY[b.label]) : b.label}</th>
              <td>{num(b.count)}</td>
              <td>{pct(b.share, 1)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="pool-legend">{t("band.poolLegend")}</p>

      {result.referenceOnly && (
        <div className="callout callout-cost" style={{ marginTop: 14 }}>
          <p>
            <strong>{t("common.referenceOnly")}</strong>{" "}
            {result.forum === "consumer"
              ? t("band.referenceConsumer")
              : t("band.referenceCriminal")}
          </p>
        </div>
      )}
    </figure>
  );
}
