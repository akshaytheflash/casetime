"use client";

import type { FormEvent } from "react";
import type { EstimateInput } from "../lib/types";
import {
  CASE_TYPE_HINT_KEY,
  CASE_TYPE_LABEL_KEY,
  STATES,
} from "../lib/types";
import { categoriesForState, AID_CATEGORY_KEY } from "../lib/legalAid";
import { useI18n } from "./I18nProvider";

const CASE_TYPES = Object.keys(CASE_TYPE_LABEL_KEY) as EstimateInput["caseType"][];

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
  const { t } = useI18n();
  const set = <K extends keyof EstimateInput>(k: K, v: EstimateInput[K]) =>
    onChange({ ...value, [k]: v });

  const setNumber = (k: keyof EstimateInput, raw: string) => {
    const n = parseFloat(raw);
    set(k, (Number.isFinite(n) ? n : 0) as never);
  };

  const claimLabel =
    value.caseType === "consumer"
      ? t("docket.claimConsumer")
      : value.caseType === "cheque"
        ? t("docket.claimCheque")
        : t("docket.claim");

  const claimHint =
    value.caseType === "consumer"
      ? t("docket.claimHintConsumer")
      : value.caseType === "cheque"
        ? t("docket.claimHintCheque")
        : t("docket.claimHint");

  const cats = categoriesForState(value.state);

  return (
    <form className="docket-form" id="docket" onSubmit={onSubmit}>
      <h2 className="h2" style={{ marginBottom: 8 }}>
        {t("docket.title")}
      </h2>
      <p className="form-intro">{t("docket.intro")}</p>

      <div className="field">
        <label htmlFor="caseType">{t("docket.caseType")}</label>
        <select
          id="caseType"
          value={value.caseType}
          onChange={(e) => set("caseType", e.target.value as EstimateInput["caseType"])}
        >
          {CASE_TYPES.map((k) => (
            <option key={k} value={k}>
              {t(CASE_TYPE_LABEL_KEY[k])}
            </option>
          ))}
        </select>
        <span className="field-hint">{t(CASE_TYPE_HINT_KEY[value.caseType])}</span>
      </div>

      <div className="field">
        <label htmlFor="state">{t("docket.state")}</label>
        <select id="state" value={value.state} onChange={(e) => set("state", e.target.value)}>
          {STATES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.id === "Other" ? t("state.other") : s.label}
            </option>
          ))}
        </select>
        <span className="field-hint">{t("docket.stateHint")}</span>
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
        <summary>
          <span>{t("docket.aidSummary")}</span>
          <span className="summary-open" aria-hidden="true">
            {t("common.open")}
          </span>
          <span className="summary-close" aria-hidden="true">
            {t("common.close")}
          </span>
        </summary>
        <div className="details-body">
          <p className="field-hint" style={{ marginTop: 0 }}>
            {t("docket.aidIntro")}
          </p>

          <div className="field" style={{ marginTop: 12 }}>
            <label htmlFor="annualIncome">{t("docket.income")}</label>
            <div className="input-money">
              <span aria-hidden="true">₹</span>
              <input
                id="annualIncome"
                type="number"
                min={0}
                step={10000}
                inputMode="numeric"
                placeholder={t("docket.incomePlaceholder")}
                value={value.annualIncome ?? ""}
                onChange={(e) => {
                  const raw = e.target.value;
                  set("annualIncome", raw === "" ? null : Math.max(0, parseFloat(raw) || 0));
                }}
              />
            </div>
            <span className="field-hint">{t("docket.incomeHint")}</span>
          </div>

          <fieldset>
            <legend>{t("docket.categoriesLegend")}</legend>
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
                    {AID_CATEGORY_KEY[c.id] ? t(AID_CATEGORY_KEY[c.id]) : c.label}{" "}
                    <span className="cite">{c.cite}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <p className="field-hint">{t("docket.aidFootnote")}</p>
        </div>
      </details>

      <details>
        <summary>
          <span>{t("docket.assumptions")}</span>
          <span className="summary-open" aria-hidden="true">
            {t("common.open")}
          </span>
          <span className="summary-close" aria-hidden="true">
            {t("common.close")}
          </span>
        </summary>
        <div className="details-body">
          <div className="input-row">
            <div className="field">
              <label htmlFor="advocate">{t("docket.advocate")}</label>
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
              <span className="field-hint">{t("docket.advocateHint")}</span>
            </div>

            <div className="field">
              <label htmlFor="wage">{t("docket.wage")}</label>
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
              <span className="field-hint">{t("docket.wageHint")}</span>
            </div>

            <div className="field">
              <label htmlFor="hearings">{t("docket.hearings")}</label>
              <input
                id="hearings"
                type="number"
                min={0.1}
                max={4}
                step={0.1}
                value={value.hearingsPerMonth}
                onChange={(e) => setNumber("hearingsPerMonth", e.target.value)}
              />
              <span className="field-hint">{t("docket.hearingsHint")}</span>
            </div>

            <div className="field">
              <label htmlFor="days">{t("docket.days")}</label>
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
              <label htmlFor="repo">{t("docket.repo")}</label>
              <input
                id="repo"
                type="number"
                min={0}
                max={30}
                step={0.05}
                value={value.repoRate}
                onChange={(e) => setNumber("repoRate", e.target.value)}
              />
              <span className="field-hint">{t("docket.repoHint")}</span>
            </div>

            <div className="field">
              <label htmlFor="courtLevel">{t("docket.courtLevel")}</label>
              <select
                id="courtLevel"
                value={value.courtLevel}
                onChange={(e) => set("courtLevel", e.target.value as EstimateInput["courtLevel"])}
              >
                <option value="district">{t("docket.courtDistrict")}</option>
                <option value="high">{t("docket.courtHigh")}</option>
              </select>
              <span className="field-hint">{t("docket.courtLevelHint")}</span>
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
        {loading ? t("docket.building") : t("docket.submit")}
      </button>
      <p className="field-hint" style={{ marginTop: 8 }}>
        {t("docket.privacy")}
      </p>
      <p className="field-hint" style={{ marginTop: 4 }}>
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
          {t("common.resetToExample")}
        </button>
      </p>
      <p className="visually-hidden" aria-live="polite">
        {loading ? t("docket.buildingAria") : ""}
      </p>
    </form>
  );
}
