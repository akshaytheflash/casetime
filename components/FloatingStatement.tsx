"use client";

import { useEffect, useState } from "react";
import type { EstimateResult } from "../lib/estimator";
import { inr, inrShort, months } from "../lib/format";

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
      aria-label="Running total"
    >
      <button
        type="button"
        className="tape-head"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="tape-label">
          {dirty ? "Total changes — rebuild to update" : "Total planning cost"}
        </span>
        <span className="tape-total">{inrShort(result.total)}</span>
        <span className="tape-chevron" aria-hidden="true">
          {open ? "▾" : "▴"}
        </span>
      </button>

      <div className="tape-body">
        <dl className="tape-lines">
          <div>
            <dt>Court fee</dt>
            <dd>{result.courtFee === null ? "Not yet sourced" : inr(result.courtFee)}</dd>
          </div>
          <div>
            <dt>Advocate</dt>
            <dd>{result.advocateWaived ? "₹0 · legal aid" : inr(result.advocateTotal)}</dd>
          </div>
          <div>
            <dt>Lost wages</dt>
            <dd>{inr(result.opportunityCost)}</dd>
          </div>
          <div>
            <dt>Cost of money</dt>
            <dd>{inr(result.interest)}</dd>
          </div>
          <div className="tape-sub">
            <dt>Litigation cost</dt>
            <dd>{inr(result.litigationCost)}</dd>
          </div>
          <div className="tape-sub">
            <dt>Cost of waiting</dt>
            <dd>{inr(result.delayCost)}</dd>
          </div>
        </dl>
        <p className="tape-foot">
          {months(result.monthsUsed)} in the queue · {inr(result.perMonth)} a month
        </p>
        {dirty && (
          <button type="button" className="tape-rebuild" onClick={onRebuild}>
            Rebuild with your new inputs
          </button>
        )}
      </div>
    </aside>
  );
}
