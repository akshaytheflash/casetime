"use client";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { EstimateInput } from "../lib/types";
import { WORKAROUNDS } from "../lib/workarounds";
import EstimatorForm from "../components/EstimatorForm";
import Results from "../components/Results";
import type { EstimateResult } from "../lib/estimator";

const DEFAULTS: EstimateInput = {
  caseType: "property",
  state: "Delhi",
  courtLevel: "district",
  suitValue: 500000,
  advocatePerAppearance: 5000,
  dailyWage: 327,
  daysPerHearing: 1,
  hearingsPerMonth: 1,
};

export default function Home() {
  const [value, setValue] = useState<EstimateInput>(DEFAULTS);
  const [out, setOut] = useState<{ result: EstimateResult; scatter: never[]; explainer: { text: string; via: "llm" | "fallback" } } | null>(null);
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/njdg").then((r) => r.json()).then((d) => {
      if (d.source === "dated-snapshot (NJDG live fetch failed — see methodology page)") {
        setBanner(`Showing dated NJDG snapshot (${d.fetchedAt}). Live fetch failed — check Methodology.`);
      }
    }).catch(() => setBanner("NJDG live fetch failed — showing dated snapshot."));
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Estimate failed");
      setOut(data);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Estimate failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "24px 18px", fontFamily: "system-ui, sans-serif", lineHeight: 1.5 }}>
      <header>
        <h1 style={{ marginBottom: 4 }}>CaseTime</h1>
        <p style={{ color: "#444", marginTop: 0 }}>
          Court time vs real litigation cost — with workarounds. <strong>Planning estimate, not legal advice.</strong>{" "}
          <a href="/methodology">Methodology</a> · <a href="/sources">Sources</a>
        </p>
      </header>
      {banner && (
        <div style={{ background: "#ffe8e0", border: "1px solid #d97a52", borderRadius: 10, padding: 12, marginBottom: 14 }}>
          ⚠️ {banner} Per-case API not configured — showing NJDG aggregates.
        </div>
      )}
      <EstimatorForm value={value} onChange={setValue} onSubmit={submit} loading={loading} />
      {out && <Results result={out.result} scatter={out.scatter as unknown as { suitValue: number; total: number; months: number }[]} explainer={out.explainer} />}
      <section style={{ marginTop: 22 }}>
        <h2>3 workarounds to try before (or instead of) a long suit</h2>
        {WORKAROUNDS.map((w) => (
          <article key={w.id} style={{ border: "1px solid #d8d8d8", borderRadius: 10, padding: 14, marginBottom: 12 }}>
            <h3 style={{ marginTop: 0 }}>{w.title}</h3>
            <p><strong>When:</strong> {w.when}</p>
            <p><strong>How:</strong> {w.how}</p>
            <p><strong>Cost/time:</strong> {w.costTime}</p>
            <p style={{ fontSize: 13, color: "#555" }}>{w.source}</p>
          </article>
        ))}
      </section>
      <section style={{ marginTop: 18, fontSize: 14, color: "#444" }}>
        <h2>Backlog at a glance (NJDG district courts)</h2>
        <NjdgCard />
      </section>
      <footer style={{ marginTop: 28, borderTop: "1px solid #ddd", paddingTop: 12, fontSize: 13, color: "#666" }}>
        CaseTime · Code for a Billion (Code for India) — Timely Justice. Data: NJDG (njdg.ecourts.gov.in). This is an
        estimator, not a prediction and not legal advice. Consult a legal-aid clinic or advocate for your case.
      </footer>
    </main>
  );
}

function NjdgCard() {
  const [s, setS] = useState<{ p: number; d: number; at: string } | null>(null);
  useEffect(() => {
    fetch("/api/njdg").then((r) => r.json()).then((d) => {
      const l = d.live;
      setS({ p: l.pendency.total, d: l.disposedLastMonth.total, at: d.fetchedAt || l.fetchedAt });
    }).catch(() => undefined);
  }, []);
  if (!s) return <p>Loading NJDG…</p>;
  const clear = (s.p / Math.max(s.d, 1) / 12).toFixed(2);
  return (
    <p>
      <strong>{s.p.toLocaleString("en-IN")} cases pending</strong> across district courts (Civil 1,12,52,654 · Criminal
      4,08,66,534) · {s.d.toLocaleString("en-IN")} disposed last month → full-queue clearance ≈{" "}
      <strong>{clear} years</strong> if no new cases arrived. Fetched {s.at}. Source:{" "}
      <a href="https://njdg.ecourts.gov.in/">njdg.ecourts.gov.in</a>.
    </p>
  );
}
