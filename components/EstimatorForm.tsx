import type { FormEvent } from "react";
import type { EstimateInput } from "../lib/types";
import { CASE_TYPE_LABEL } from "../lib/types";

const CASE_TYPES = Object.entries(CASE_TYPE_LABEL) as [EstimateInput["caseType"], string][];
const STATES = ["Delhi", "Maharashtra", "Karnataka", "Tamil Nadu", "Other"];

export default function EstimatorForm(props: {
  value: EstimateInput;
  onChange: (v: EstimateInput) => void;
  onSubmit: (e: FormEvent) => void;
  loading: boolean;
}) {
  const { value, onChange } = props;
  const set = <K extends keyof EstimateInput>(k: K, v: EstimateInput[K]) =>
    onChange({ ...value, [k]: v });
  const num = (k: "suitValue" | "advocatePerAppearance" | "dailyWage" | "daysPerHearing" | "hearingsPerMonth") => ({
    type: "number",
    min: k === "daysPerHearing" || k === "hearingsPerMonth" ? 0 : 1,
    value: value[k] as unknown as number,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => set(k, parseFloat(e.target.value || "0") as never),
  });
  return (
    <form onSubmit={props.onSubmit} style={{ border: "1px solid #d8d8d8", borderRadius: 10, padding: 16 }}>
      <h2 style={{ marginTop: 0 }}>Your case (planning estimate)</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 12 }}>
        <label>
          Case type
          <select value={value.caseType} onChange={(e) => set("caseType", e.target.value as never)} style={inp}>
            {CASE_TYPES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
        </label>
        <label>
          State (sourced fee states shown)
          <select value={value.state} onChange={(e) => set("state", e.target.value)} style={inp}>
            {STATES.map((s) => <option key={s} value={s}>{s === "Other" ? "Other state (Central schedule)" : s}</option>)}
          </select>
        </label>
        <label>
          Court level
          <select value={value.courtLevel} onChange={(e) => set("courtLevel", e.target.value as never)} style={inp}>
            <option value="district">District Court</option>
            <option value="high">High Court</option>
          </select>
        </label>
        <label>
          Suit value / amount at stake (₹)
          <input {...num("suitValue")} style={inp} />
        </label>
        <label>
          Advocate fee per appearance (₹) — use your quote
          <input {...num("advocatePerAppearance")} style={inp} />
        </label>
        <label>
          Your daily wage / income (₹ per day)
          <input {...num("dailyWage")} style={inp} />
        </label>
        <label>
          Days per hearing (assumption, default 1)
          <input {...num("daysPerHearing")} style={inp} />
        </label>
        <label>
          Hearings per month (assumption, default 1)
          <input {...num("hearingsPerMonth")} style={inp} />
        </label>
      </div>
      <button type="submit" disabled={props.loading} style={btn}>
        {props.loading ? "Estimating…" : "Estimate time & cost"}
      </button>
    </form>
  );
}

const inp: React.CSSProperties = { display: "block", width: "100%", padding: "8px 10px", marginTop: 4, border: "1px solid #bbb", borderRadius: 6, fontSize: 15 };
const btn: React.CSSProperties = { marginTop: 14, background: "#06293d", color: "#fff", padding: "11px 22px", borderRadius: 8, border: "none", fontSize: 16, cursor: "pointer" };
