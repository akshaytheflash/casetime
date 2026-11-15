"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { EstimateInput } from "../lib/types";
import type { EstimateResult } from "../lib/estimator";
import { inr, months } from "../lib/format";
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
import FloatingStatement from "../components/FloatingStatement";
import { useI18n } from "../components/I18nProvider";

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
  const { t } = useI18n();
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
      if (!res.ok) throw new Error(data.error || t("common.errorBuild"));
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
      setError(err instanceof Error ? err.message : t("common.errorBuild"));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        {t("common.skipToDocket")}
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
                  <strong>{t("result.dirty")}</strong>{" "}
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
                    {t("result.rebuild")}
                  </button>
                </p>
              </div>
            )}

            {payload ? (
              <div className={loading ? "" : "result-enter"}>
                <div className="section-head" style={{ marginBottom: 8 }}>
                  <h2 className="h2">{t("result.heading")}</h2>
                  <span className="tag">
                    {payload.result.cohort ? t("result.tagCohort") : t("result.tagQueue")}
                  </span>
                </div>
                <p className="result-headline">
                  {t("result.headline", {
                    delay: inr(payload.result.delayCost),
                    total: inr(payload.result.total),
                  })}
                </p>
                <p className="result-sub">
                  {t("result.sub", {
                    litigation: inr(payload.result.litigationCost),
                    delay: inr(payload.result.delayCost),
                    months: months(payload.result.monthsUsed),
                    basis: payload.result.referenceOnly
                      ? t("result.basisReference")
                      : t("result.basisCivil"),
                  })}
                </p>
                {payload.result.legalAid.eligible && (
                  <p className="result-sub" style={{ color: "var(--sage-ink)" }}>
                    <span className="tag tag-sage">{t("common.legalAid")}</span>{" "}
                    {t("result.legalAidNote", {
                      saving: inr(payload.result.legalAid.advocateSaving),
                    })}
                  </p>
                )}
                <CostLedger result={payload.result} input={payload.input} />
              </div>
            ) : loading ? (
              <p className="section-note">{t("result.building")}</p>
            ) : (
              <div className="callout callout-cost">
                <p>
                  <strong>{t("result.failed")}</strong> {error ?? t("result.failedHint")}
                </p>
              </div>
            )}
          </div>
        </div>

        {payload && <LegalAidPanel result={payload.result} state={payload.input.state} />}
        {payload && <AlternativesSection result={payload.result} input={payload.input} />}
        {payload && (
          <PlacesSection
            result={payload.result}
            places={places}
            state={payload.input.state}
          />
        )}
        {payload && <NoticePanel notice={notice} />}

        <section
          className="shell"
          style={{ paddingTop: 38, paddingBottom: 38, borderTop: "1px solid var(--ink)" }}
          aria-labelledby="method-note-heading"
        >
          <div className="section-head">
            <div>
              <h2 className="h2" id="method-note-heading">
                {t("homeMethod.heading")}
              </h2>
            </div>
          </div>
          <div className="grid-2">
            <div>
              <p className="section-note" style={{ maxWidth: "58ch" }}>
                {t("homeMethod.lowerBound")}
              </p>
              <p className="section-note" style={{ maxWidth: "58ch", marginTop: 10 }}>
                {t("homeMethod.ageBands")}
              </p>
            </div>
            <div>
              <p className="section-note" style={{ maxWidth: "58ch" }}>
                {t("homeMethod.sourced")}
              </p>
              <p className="section-note" style={{ maxWidth: "58ch", marginTop: 10 }}>
                {t("homeMethod.cohort")}{" "}
                <a href="/methodology">{t("homeMethod.link")}</a>.
              </p>
            </div>
          </div>
        </section>

        <footer className="site-footer">
          <div className="shell footer-grid">
            <div>
              <p>{t("footer.about")}</p>
              <p>{t("footer.disclaimer")}</p>
            </div>
            <div>
              <p>
                <a href="/methodology">{t("common.methodology")}</a> ·{" "}
                <a href="/sources">{t("common.sources")}</a> ·{" "}
                <a href="https://njdg.ecourts.gov.in/" target="_blank" rel="noreferrer">
                  NJDG
                </a>
              </p>
              <p>{t("footer.dataNote")}</p>
            </div>
          </div>
        </footer>
      </div>

      <FloatingStatement
        result={payload?.result ?? null}
        dirty={dirty}
        onRebuild={() => void runEstimate(input, { scroll: false })}
      />

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
