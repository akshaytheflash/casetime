"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { EstimateInput } from "../lib/types";
import { CASE_TYPE_LABEL } from "../lib/types";
import type { EstimateResult } from "../lib/estimator";
import { inr, inrShort, months } from "../lib/format";
import { buildNotice } from "../lib/notice";
import { placesForState } from "../lib/places";
import Masthead, { type NjdgStatus } from "../components/Masthead";
import Hero from "../components/Hero";
import DocketForm from "../components/DocketForm";
import CostLedger from "../components/CostLedger";
import LegalAidPanel from "../components/LegalAidPanel";
import AlternativesSection from "../components/AlternativesSection";
import PlacesSection from "../components/PlacesSection";
import NoticePanel from "../components/NoticePanel";
import Statement from "../components/Statement";

const DEFAULTS: EstimateInput = {
  caseType: "money",
  state: "Delhi",
  courtLevel: "district",
  suitValue: 500000,
  advocatePerAppearance: 9000,
  dailyWage: 327.4,
  daysPerHearing: 1,
  hearingsPerMonth: 1,
  repoRate: 5.5,
  annualIncome: null,
  legalAidCategories: [],
};

interface Payload {
  input: EstimateInput;
  result: EstimateResult;
}

export default function Home() {
  const [input, setInput] = useState<EstimateInput>(DEFAULTS);
  const [payload, setPayload] = useState<Payload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [njdg, setNjdg] = useState<NjdgStatus | null>(null);
  const [eci, setEci] = useState(false);

  async function runEstimate(next: EstimateInput, opts: { scroll?: boolean } = {}) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "The estimate did not build.");
      setPayload({ input: data.input as EstimateInput, result: data.result as EstimateResult });
      setDirty(false);
      if (opts.scroll) {
        const reduce =
          typeof window !== "undefined" &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.requestAnimationFrame(() => {
          document.getElementById("result")?.scrollIntoView({
            behavior: reduce ? "auto" : "smooth",
            block: "start",
          });
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "The estimate did not build.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void runEstimate(DEFAULTS, { scroll: false });

    fetch("/api/njdg")
      .then((r) => r.json())
      .then((d) => {
        const live = d.live;
        if (live?.pendency?.total) {
          setNjdg({
            total: live.pendency.total,
            civil: live.pendency.civil,
            disposed: live.disposedLastMonth?.civil ?? 0,
            fetchedAt: d.fetchedAt || live.fetchedAt,
            source: d.source || "dated-snapshot",
          });
        }
      })
      .catch(() => undefined);

    fetch("/api/health")
      .then((r) => r.json())
      .then((d) => setEci(Boolean(d.eci)))
      .catch(() => undefined);
  }, []);

  function handleChange(next: EstimateInput) {
    setInput(next);
    setDirty(true);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    void runEstimate(input, { scroll: true });
  }

  function handleReset() {
    setInput(DEFAULTS);
    setDirty(false);
    void runEstimate(DEFAULTS, { scroll: false });
  }

  const resultInput = payload?.input ?? input;
  const places = useMemo(() => placesForState(resultInput.state), [resultInput.state]);
  const notice = useMemo(() => buildNotice(resultInput), [resultInput]);

  return (
    <main>
      <a className="skip" href="#docket">
        Skip to the docket
      </a>

      <div className="screen-only">
        <Masthead njdg={njdg} eci={eci} />
        <Hero result={payload?.result ?? null} input={resultInput} njdg={njdg} />

        <div className="shell workbench">
          <div className="docket">
            <DocketForm
              value={input}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onReset={handleReset}
              loading={loading}
              error={error}
            />
          </div>

          <div id="result" className="result" aria-live="polite">
            {dirty && payload && (
              <div className="callout" style={{ marginTop: 0 }}>
                <p>
                  <strong>The statement below uses the previous inputs.</strong>{" "}
                  <button
                    type="button"
                    onClick={() => void runEstimate(input, { scroll: false })}
                    style={{
                      background: "none",
                      border: 0,
                      padding: 0,
                      color: "var(--ledger)",
                      textDecoration: "underline",
                      cursor: "pointer",
                      font: "inherit",
                    }}
                  >
                    Rebuild it now
                  </button>{" "}
                  to see the change.
                </p>
              </div>
            )}

            {payload ? (
              <div className={loading ? "" : "result-enter"}>
                <div className="section-head" style={{ marginBottom: 8 }}>
                  <h2 className="h2">What the queue costs</h2>
                  <span className="tag">
                    {payload.result.cohort ? "Disposed-case cohort" : "Queue-based lower bound"}
                  </span>
                </div>
                <p className="result-headline">
                  {inr(payload.result.delayCost)} of the {inr(payload.result.total)} is the wait.
                </p>
                <p className="result-sub">
                  The fee and appearances are {inr(payload.result.litigationCost)}. The lost wages
                  and the money tied up are {inr(payload.result.delayCost)}. The time figure is{" "}
                  {months(payload.result.monthsUsed)} of{" "}
                  {payload.result.referenceOnly ? "a reference queue" : "the civil queue"} — read it
                  as a floor, not a schedule.
                </p>
                {payload.result.legalAid.eligible && (
                  <p className="result-sub" style={{ color: "var(--sage-ink)" }}>
                    <span className="tag tag-sage">Legal aid</span> The advocate line is ₹0 because
                    you may qualify under s.12. That removes {inr(payload.result.legalAid.advocateSaving)}{" "}
                    from the statement.
                  </p>
                )}
                <CostLedger result={payload.result} />
              </div>
            ) : loading ? (
              <p className="section-note">
                Building the example statement from the NJDG snapshot and the sourced schedules…
              </p>
            ) : (
              <div className="callout callout-cost">
                <p>
                  <strong>The statement did not build.</strong>{" "}
                  {error ?? "Check the claim amount and try again."}
                </p>
              </div>
            )}
          </div>
        </div>

        {payload && <LegalAidPanel result={payload.result} />}
        {payload && <AlternativesSection result={payload.result} />}
        {payload && <PlacesSection result={payload.result} places={places} />}
        {payload && <NoticePanel notice={notice} />}

        <section
          className="shell"
          style={{ paddingTop: 38, paddingBottom: 38, borderTop: "1px solid var(--ink)" }}
          aria-labelledby="method-note-heading"
        >
          <div className="section-head">
            <div>
              <h2 className="h2" id="method-note-heading">
                What this estimate is, and is not
              </h2>
            </div>
          </div>
          <div className="grid-2">
            <div>
              <p className="section-note" style={{ maxWidth: "58ch" }}>
                <strong>It is a queue-based lower bound.</strong> The time figure is pendency ÷
                monthly disposals: how long today&apos;s backlog would take to clear at today&apos;s
                throughput if no new cases arrived. It is not a prediction for your case.
              </p>
              <p className="section-note" style={{ maxWidth: "58ch", marginTop: 10 }}>
                <strong>It does not use age bands as disposal times.</strong> NJDG publishes the age
                of cases still pending, not how long disposed cases took. Cases that settle or
                dispose early leave the pending pool, so the age bands carry survivorship bias. We
                show them as the age of the waiting stock and keep them out of the cost calculation.
              </p>
            </div>
            <div>
              <p className="section-note" style={{ maxWidth: "58ch" }}>
                <strong>Every rupee has a source or a formula.</strong> Court fees come from the State
                Act schedules (Delhi, Maharashtra, Karnataka, Tamil Nadu); a State without a sourced
                schedule is marked <em>not yet sourced</em> and excluded from the total. The wage is
                the VB-G RAM G national average. The cost of money is the RBI repo rate. The advocate
                fee is your input, anchored to the DSLSA panel rate.
              </p>
              <p className="section-note" style={{ maxWidth: "58ch", marginTop: 10 }}>
                <strong>A cohort would be better.</strong> With an eCourtsIndia partner key, the app
                can use filing-to-decision durations from disposed cases. Without the key, it says so
                on this screen and uses the labelled floor.{" "}
                <a href="/methodology">Read the methodology</a>.
              </p>
            </div>
          </div>
        </section>

        <footer className="site-footer">
          <div className="shell footer-grid">
            <div>
              <p>
                <strong>CaseTime</strong> · Code for a Billion (Code for India) — Timely Justice.
                Built with Next.js, node:sqlite and the NJDG dated snapshot.
              </p>
              <p>
                This is a planning estimate, not legal advice, not a prediction, and not a quote. For
                advice on your case, go to the DLSA or an advocate.
              </p>
            </div>
            <div>
              <p>
                <a href="/methodology">Methodology</a> · <a href="/sources">Sources</a> ·{" "}
                <a href="https://njdg.ecourts.gov.in/" target="_blank" rel="noreferrer">
                  NJDG
                </a>
              </p>
              <p>
                Data accessed 6 November 2026. Court-fee Acts and the RBI rate are cited per row on
                the sources page.
              </p>
            </div>
          </div>
        </footer>
      </div>

      {payload && (
        <Statement
          input={payload.input}
          result={payload.result}
          places={places}
          notice={notice}
        />
      )}
    </main>
  );
}
