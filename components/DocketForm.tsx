import type { FormEvent } from "react";
import type { EstimateInput } from "../lib/types";
import { CASE_TYPE_HINT, CASE_TYPE_LABEL, STATES } from "../lib/types";
import { categoriesForState } from "../lib/legalAid";
import { inr } from "../lib/format";

const CASE_TYPES = Object.entries(CASE_TYPE_LABEL) as [EstimateInput["caseType"], string][];

export default function DocketForm({
  value,
  onChange,
  onSubmit,
  onReset,
  loading,
  error,
}: {
  value: EstimateInput;
  onChange: (v: EstimateInput) => void;
  onSubmit: (e: FormEvent) => void;
  onReset: () => void;
  loading: boolean;
  error: string | null;
}) {
  const set = <K extends keyof EstimateInput>(k: K, v: EstimateInput[K]) =>
    onChange({ ...value, [k]: v });

  const setNumber = (k: keyof EstimateInput, raw: string) => {
    const n = parseFloat(raw);
    set(k, (Number.isFinite(n) ? n : 0) as never);
  };

  const claimLabel =
    value.caseType === "consumer"
      ? "Value of goods or services paid (₹)"
      : value.caseType === "cheque"
        ? "Cheque amount (₹)"
        : "Claim / amount at stake (₹)";

  const claimHint =
    value.caseType === "consumer"
      ? "The consumer fee follows the consideration paid, not the compensation claimed."
      : value.caseType === "cheque"
        ? "The Delhi fee for a s.138 complaint is calculated on the value of the instrument."
        : "For a money suit, the fee follows the amount claimed. Other reliefs are valued differently.";

  const cats = categoriesForState(value.state);

  return (
    <form className="docket-form" id="docket" onSubmit={onSubmit}>
      <h2 className="h2" style={{ marginBottom: 8 }}>
        Your docket
      </h2>
      <p className="form-intro">
        Start with the case you are weighing. The example is a ₹5,00,000 money recovery in Delhi;
        change any field and rebuild.
      </p>

      <div className="field">
        <label htmlFor="caseType">Case type</label>
        <select
          id="caseType"
          value={value.caseType}
          onChange={(e) => set("caseType", e.target.value as EstimateInput["caseType"])}
        >
          {CASE_TYPES.map(([k, l]) => (
            <option key={k} value={k}>
              {l}
            </option>
          ))}
        </select>
        <span className="field-hint">{CASE_TYPE_HINT[value.caseType]}</span>
      </div>

      <div className="field">
        <label htmlFor="state">State</label>
        <select id="state" value={value.state} onChange={(e) => set("state", e.target.value)}>
          {STATES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
        <span className="field-hint">
          Fee schedules are sourced for Delhi, Maharashtra, Karnataka and Tamil Nadu. Any other
          State is marked <em>not yet sourced</em>; no default fee is added.
        </span>
      </div>

      <div className="field">
        <label htmlFor="suitValue">{claimLabel}</label>
        <div className="input-money">
          <span aria-hidden="true">₹</span>
          <input
            id="suitValue"
            type="number"
            min={1}
            step={1000}
            inputMode="numeric"
            value={value.suitValue}
            onChange={(e) => setNumber("suitValue", e.target.value)}
          />
        </div>
        <span className="field-hint">{claimHint}</span>
      </div>

      <details open>
        <summary>Free legal aid under s.12</summary>
        <div className="details-body">
          <p className="field-hint" style={{ marginTop: 0 }}>
            If you meet a criterion, the advocate line drops to ₹0 and the DLSA route appears in the
            statement. A woman or child qualifies under s.12(c) irrespective of income.
          </p>

          <div className="field" style={{ marginTop: 12 }}>
            <label htmlFor="annualIncome">Annual household income (₹, optional)</label>
            <div className="input-money">
              <span aria-hidden="true">₹</span>
              <input
                id="annualIncome"
                type="number"
                min={0}
                step={10000}
                inputMode="numeric"
                placeholder="Not entered"
                value={value.annualIncome ?? ""}
                onChange={(e) => {
                  const raw = e.target.value;
                  set("annualIncome", raw === "" ? null : Math.max(0, parseFloat(raw) || 0));
                }}
              />
            </div>
            <span className="field-hint">
              The State ceiling is applied only if you enter a figure. It is not assumed.
            </span>
          </div>

          <fieldset>
            <legend>Which of these apply?</legend>
            <div className="check-grid">
              {cats.map((c) => (
                <label className="check" key={c.id}>
                  <input
                    type="checkbox"
                    checked={value.legalAidCategories.includes(c.id)}
                    onChange={(e) => {
                      const next = e.target.checked
                        ? [...value.legalAidCategories, c.id]
                        : value.legalAidCategories.filter((x) => x !== c.id);
                      set("legalAidCategories", next);
                    }}
                  />
                  <span>
                    {c.label} <span className="cite">{c.cite}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <p className="field-hint">
            Eligibility still depends on the Authority being satisfied there is a prima facie case
            (s.13(1)). An affidavit of income is generally sufficient (s.13(2)).
          </p>
        </div>
      </details>

      <details>
        <summary>Adjust the assumptions</summary>
        <div className="details-body">
          <div className="input-row">
            <div className="field">
              <label htmlFor="advocate">Advocate per appearance (₹)</label>
              <div className="input-money">
                <span aria-hidden="true">₹</span>
                <input
                  id="advocate"
                  type="number"
                  min={0}
                  step={500}
                  value={value.advocatePerAppearance}
                  onChange={(e) => setNumber("advocatePerAppearance", e.target.value)}
                />
              </div>
              <span className="field-hint">
                Default ₹9,000 is the DSLSA panel rate, not a market rate. Enter your quote.
              </span>
            </div>

            <div className="field">
              <label htmlFor="wage">Your daily income (₹)</label>
              <div className="input-money">
                <span aria-hidden="true">₹</span>
                <input
                  id="wage"
                  type="number"
                  min={0}
                  step={10}
                  value={value.dailyWage}
                  onChange={(e) => setNumber("dailyWage", e.target.value)}
                />
              </div>
              <span className="field-hint">Default ₹327.40 is the VB-G RAM G national average.</span>
            </div>

            <div className="field">
              <label htmlFor="hearings">Hearings per month</label>
              <input
                id="hearings"
                type="number"
                min={0.1}
                max={4}
                step={0.1}
                value={value.hearingsPerMonth}
                onChange={(e) => setNumber("hearingsPerMonth", e.target.value)}
              />
              <span className="field-hint">NJDG does not publish hearings per case. This is yours.</span>
            </div>

            <div className="field">
              <label htmlFor="days">Days lost per hearing</label>
              <input
                id="days"
                type="number"
                min={1}
                max={10}
                step={1}
                value={value.daysPerHearing}
                onChange={(e) => setNumber("daysPerHearing", e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="repo">Cost-of-money rate (% per year)</label>
              <input
                id="repo"
                type="number"
                min={0}
                max={30}
                step={0.05}
                value={value.repoRate}
                onChange={(e) => setNumber("repoRate", e.target.value)}
              />
              <span className="field-hint">Default 5.50% is the RBI repo rate, 7 Oct 2026.</span>
            </div>

            <div className="field">
              <label htmlFor="courtLevel">Court level</label>
              <select
                id="courtLevel"
                value={value.courtLevel}
                onChange={(e) => set("courtLevel", e.target.value as EstimateInput["courtLevel"])}
              >
                <option value="district">District court</option>
                <option value="high">High Court</option>
              </select>
              <span className="field-hint">
                The NJDG snapshot covers district courts; the High Court view is labelled as the
                district baseline.
              </span>
            </div>
          </div>
        </div>
      </details>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <button className="btn btn-block" type="submit" disabled={loading}>
        {loading ? "Building the statement…" : "Build my cost statement"}
      </button>
      <p className="field-hint" style={{ marginTop: 8 }}>
        No login. The estimate is computed on the server from the inputs above; the database stores
        only the anonymised estimate row.{" "}
        <button
          type="button"
          onClick={onReset}
          style={{
            background: "none",
            border: 0,
            padding: 0,
            color: "var(--ledger)",
            textDecoration: "underline",
            cursor: "pointer",
            fontSize: "inherit",
          }}
        >
          Reset to the example
        </button>
        .
      </p>
      <p className="visually-hidden" aria-live="polite">
        {loading ? "Building the estimate" : ""}
      </p>
    </form>
  );
}
