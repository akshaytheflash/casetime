import type { EstimateInput } from "../lib/types";
import { CASE_TYPE_LABEL } from "../lib/types";
import type { EstimateResult } from "../lib/estimator";
import { inrShort, months, num } from "../lib/format";
import TimeCostBand from "./TimeCostBand";
import type { NjdgStatus } from "./Masthead";

const HEADLINE_LABEL: Record<EstimateInput["caseType"], string> = {
  family: "family dispute",
  property: "property dispute",
  money: "money claim",
  commercial: "commercial claim",
  consumer: "consumer complaint",
  cheque: "cheque complaint",
  criminal: "criminal complaint",
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
  const claim = inrShort(input.suitValue);
  const label = HEADLINE_LABEL[input.caseType];
  const stateLabel = input.state === "Other" ? "this State" : input.state;

  const pending = njdg?.total ?? 52119188;

  return (
    <section className="hero shell" aria-labelledby="hero-heading">
      <p className="hero-kicker">For a first-time litigant in India</p>
      {result ? (
        <>
          <p className="hero-statement">
            A <b>{claim}</b> {label} in {stateLabel} waits{" "}
            <b>{months(result.monthsUsed)}</b>
            {result.referenceOnly ? " on the civil-court reference queue." : "."}{" "}
            The wait alone costs:
          </p>
          <p className="hero-number" id="hero-heading" aria-live="polite">
            {inrShort(result.delayCost)}
            <span className="hero-number-of">
              out of {inrShort(result.total)} the case will cost you
            </span>
          </p>
        </>
      ) : (
        <h1 className="hero-number" id="hero-heading">
          Reading the queue…
        </h1>
      )}
      <p className="hero-deck">
        CaseTime prices the queue: the court fee, the appearances, the wages you lose and the money
        locked up in the claim. The figures below show the forums that cost less and the free legal
        help you may already qualify for.
      </p>

      <p className="hero-context">
        Against a national backlog of{" "}
        <b>{num(pending)}</b> cases in the district courts, fetched from NJDG on 6 November 2026.
        Every rupee below carries a sourced Act, schedule or rate.
      </p>

      <figure className="hero-figure">
        {result ? (
          <>
            <div className="figure-head">
              <div>
                <p className="figure-title">{CASE_TYPE_LABEL[input.caseType]} · {stateLabel} · {inrShort(input.suitValue)}</p>
                <p className="figure-sub">
                  The dot is filing. The band is the money spent along the queue.
                </p>
              </div>
              <p className="figure-sub">
                Total at the end of the queue:{" "}
                <strong style={{ color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>
                  {inrShort(result.total)}
                </strong>
              </p>
            </div>
            <TimeCostBand result={result} input={input} />
          </>
        ) : (
          <p className="figure-sub">Building the example statement…</p>
        )}
      </figure>
    </section>
  );
}
