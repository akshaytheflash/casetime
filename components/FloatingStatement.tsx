"use client";

import { useEffect, useState } from "react";
import type { EstimateResult } from "../lib/estimator";
import { inr, inrShort, months } from "../lib/format";
import { useI18n } from "./I18nProvider";

/**
 * The running total, parked over the page while you work.
 *
 * A costing desk keeps its adding-machine tape in view. This is that tape:
 * it appears once the hero scrolls away, follows you down the page, and
 * tells you when the figures on screen are stale because you changed an
 * input. Collapsed it is one line; open it is the full bill.
 */
export default function FloatingStatement({
  result,
  dirty,
  onRebuild,
}: {
  result: EstimateResult | null;
  dirty: boolean;
  onRebuild: () => void;
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const hero = document.querySelector(".hero");
    if (!hero) return;
    const io = new IntersectionObserver(
      ([entry]) => setShown(!entry.isIntersecting),
      { rootMargin: "-80px 0px 0px 0px" }
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!shown) setOpen(false);
  }, [shown]);

  if (!result || !shown) return null;

  return (
    <aside
      className={`float-tape${open ? " is-open" : ""}${dirty ? " is-dirty" : ""}`}
      aria-label={t("float.aria")}
    >
      <button
        type="button"
        className="tape-head"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="tape-label">
          {dirty ? t("float.dirty") : t("float.total")}
        </span>
        <span className="tape-total">{inrShort(result.total)}</span>
        <span className="tape-chevron" aria-hidden="true">
          {open ? "▾" : "▴"}
        </span>
      </button>

      <div className="tape-body">
        <dl className="tape-lines">
          <div>
            <dt>{t("float.courtFee")}</dt>
            <dd>{result.courtFee === null ? t("common.notYetSourced") : inr(result.courtFee)}</dd>
          </div>
          <div>
            <dt>{t("float.advocate")}</dt>
            <dd>{result.advocateWaived ? t("float.waived") : inr(result.advocateTotal)}</dd>
          </div>
          <div>
            <dt>{t("float.wages")}</dt>
            <dd>{inr(result.opportunityCost)}</dd>
          </div>
          <div>
            <dt>{t("float.money")}</dt>
            <dd>{inr(result.interest)}</dd>
          </div>
          <div className="tape-sub">
            <dt>{t("float.litigation")}</dt>
            <dd>{inr(result.litigationCost)}</dd>
          </div>
          <div className="tape-sub">
            <dt>{t("float.waiting")}</dt>
            <dd>{inr(result.delayCost)}</dd>
          </div>
        </dl>
        <p className="tape-foot">
          {t("float.foot", {
            months: months(result.monthsUsed),
            perMonth: inr(result.perMonth),
          })}
        </p>
        {dirty && (
          <button type="button" className="tape-rebuild" onClick={onRebuild}>
            {t("float.rebuild")}
          </button>
        )}
      </div>
    </aside>
  );
}
