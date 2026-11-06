# CaseTime

Court time vs real litigation cost estimator with workarounds — built for the
**Code for a Billion (Code for India)** hackathon, **Timely Justice / Legal Backlog** impact area.

> **CaseTime is an estimate, not legal advice.** Time comes from NJDG pendency
> aggregates (Little's Law + pending-pool age bands); costs from cited court-fee /
> wage / advocate schedules. Read `app/methodology/page.tsx` (also at `/methodology`)
> before quoting any number.

## Run it (30 seconds)

```bash
npm install
cp .env.example .env   # no keys = still runs in aggregate-statistics mode
npm run dev             # http://localhost:3000
```

SQLite (`casetime.db`) auto-creates on first estimate. No build step needed for dev.

## How it works

1. You enter **case type + state + court level + suit value + your advocate rate + your daily wage**.
2. `/api/estimate` returns: **time** (queue-clearance horizon + pending-pool P50/P75/P90),
   **cost** (court fee + advocate + opportunity cost, each with a source),
   **3 workarounds** (mediation · Lok Adalat · commercial pre-institution mediation s.12A),
   a **cost-vs-suit-value scatter**, and a BharatCode explainer (with template fallback on 503s).

### Time model (honest aggregates — never per-case durations)

```
queueClearMonths = pendency / monthlyDisposals        (Little's Law)
P50/P75/P90      = percentiles of pending-pool AGE from NJDG age bands
```

NJDG publishes pendency age bands, **not** how long individual cases took — so P50/P75/P90
describe the *age of cases still waiting*, which is why confidence is **low** and labelled.
Case-type mapping: family/property/money/commercial/consumer → Civil bucket; criminal → Criminal.
Court level: snapshot covers District Courts (NJDG); High Court shows the District baseline labelled as such.

## Data sources (every figure cited with access date)

| Dataset | Source | Access |
|---|---|---|
| Pendency, disposals, age bands | NJDG HTML dashboard (`njdg.ecourts.gov.in`), parsed live server-side | 2026-11-06 |
| data.gov.in NJDG datasets | Catalog linked (portal returns JS HTML) | 2026-11-06 |
| Court fees (4 states + Central) | Court Fees Act, 1870 + state schedules via cited summaries (see `/sources`) | 2026-11-06 |
| Wages (opportunity floor) | PIB / VB-G RAM G 2025 (avg ₹327.4, floor ₹300) | 2026-11-06 |
| Advocate | DSLSA legal-aid floor ₹9,000 + 2026 market ranges | 2026-11-06 |
| LLM explainer | BharatCode Qwen 3.8 27B, POST /chat/completions | live (503-tested) |
| Per-case (optional) | eCourtsIndia partner API (THIRD-PARTY, paid, key-gated) | — |

Full table with URLs: the `/sources` page. Rule of the house: **if a fee isn't sourced,
the UI says "Fee not yet sourced"** — no guessing.

## How to add a state's fees

1. Find the state's Court Fees Act Schedule I (Delhi: Court Fees (Delhi Amendment) Act;
   Maharashtra: 1959 Act; Karnataka: 1958 Act; TN: 1955 Act; etc.) on the state
   legislature / Indian Kanoon / IGR site.
2. Add one entry to `data/courtFees.json` (`state`, `openingRate`, `cap`, `act`, `source`, `confidence`).
3. The estimator picks it up automatically. Keep the source string with URL + access date.

## How to add a state's wage

Add to `stateWages` in `data/wages.json` with the PIB / state labour-department notification as `source`.
Until then the app uses the national average and labels it.

## Configuration

```
BHARATCODE_API_KEY   # server-side ONLY (bc_live_…) — never NEXT_PUBLIC_, never commit
BHARATCODE_BASE_URL  # default https://bharatcode.ai/api/model/v1
BHARATCODE_MODEL     # default qwen-3.8-27b
ECI_BASE_URL         # default https://webapi.ecourtsindia.com
ECI_KEY              # optional (eci_live_…) — absent ⇒ aggregate mode + banner
DATA_GOV_API_KEY     # optional, for data.gov.in dataset lookups
```

## API reference

- `GET /api/njdg` — live NJDG aggregates (1h SQLite cache) + dated-snapshot fallback.
- `POST /api/estimate` — `{caseType, state, courtLevel, suitValue, advocatePerAppearance,
  dailyWage, daysPerHearing, hearingsPerMonth}` → `{input, result, scatter, explainer}`.
- `GET /api/estimate?q=…` — per-case search when `ECI_KEY` set; otherwise aggregate-mode notice.
- `GET /api/health` — `{bharatcode, eci, mode}`.

## Live-call log (tested 2026-11-06)

- **NJDG**: `GET https://njdg.ecourts.gov.in/` → 200, 199KB HTML; cards + `fetchYearData`
  band string parsed (Civil 1,12,52,654; disposed 3,40,163/mo). ✅
- **BharatCode**: `GET /models` → 200, `qwen-3.8-27b` live, 262k ctx. ✅
  `POST /chat/completions` + `/responses` → **503 model_unavailable** (busy) — app backoffs
  (0/2/5s) then serves the template explainer with identical numbers. ✅ (honest fallback paths exercised)
- **eCourtsIndia partner**: no key → 401 `INVALID_TOKEN` as designed; app banner shows
  “Per-case API not configured — showing NJDG aggregates”. ✅
- **data.gov.in**: catalog search returns JS HTML (no JSON) — linked, not embedded. ✅ (documented)

## Demo script (2 minutes)

1. Home page: notice the **estimate-not-advice** framing + backlog card (5.21 crore pending).
2. Pick **Property, Delhi, ₹5,00,000, advocate ₹5,000, wage ₹327** → Estimate.
   Point at: 2.76-yr queue horizon, P50/P75/P90, ₹ breakdown with per-rupee sources,
   scatter, and the 503-fallback explainer line.
3. Open **/methodology** (Little's Law + limits) and **/sources** (fee table + access dates).
4. Show the 3 workaround cards (mediation → Lok Adalat → s.12A for commercial ≥₹3L).
5. Mention: no key = aggregate mode by design; `ECI_KEY` enables per-case lookup
   (CNRs from search results only) with 429/5xx retry, never 400.

## Submission-ready (Code for a Billion)

- **Impact area:** Timely Justice / Legal Backlog. **Size:** 5.2 crore pending (NJDG).
- **Severity:** queue clearance ≈ 2.76 yrs even with zero new filings; 25% of last month's
  disposals were contested (tail cases drag for years).
- **Quality:** deterministic math, zero-dependency charts, SQLite audit log of every estimate,
  live-parse + dated snapshot for NJDG, sourced fees/wages — “not yet sourced” > invented.
- **Proven impact (tiebreaker):** workarounds are actionable today (Legal Services Authority /
  s.12A with limitation protection), and the estimator answers the question every
  first-time litigant asks — *“how long and how much?”* — before they file.
