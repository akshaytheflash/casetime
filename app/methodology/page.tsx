import type { EstimateInput } from "../../lib/types";
import { estimate } from "../../lib/estimator";
import { inr, months, num, pct, yearsMonths } from "../../lib/format";
import { CENTRAL_FEE, CONSUMER_FEE, RBI, STATE_FEES, WAGE_SOURCE } from "../../lib/fees";
import { LEGAL_AID_CATEGORIES, LEGAL_AID_META } from "../../lib/legalAid";
import { SNAPSHOT } from "../../lib/njdg";
import Masthead from "../../components/Masthead";

export const metadata = { title: "CaseTime — Methodology" };

const EXAMPLE_INPUT: EstimateInput = {
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

export default function Methodology() {
  const ex = estimate(EXAMPLE_INPUT);

  return (
    <>
      <Masthead />
      <main className="shell prose-page">
        <p>
          <a href="/">Back to the estimator</a>
        </p>
        <p className="hero-kicker" style={{ marginTop: 18 }}>
          Methodology
        </p>
        <h1 className="display">The number is a floor, and we say so on the screen.</h1>
        <p className="hero-deck">
          CaseTime turns a court queue into a cost statement. This page shows the derivation, the
          source, and the limit of every number. If a figure is not sourced, the app says so and
          leaves it out of the total.
        </p>

        <div className="callout callout-cost" style={{ marginTop: 24 }}>
          <p>
            <strong>The correction.</strong> The first version presented NJDG pending-pool age bands
            as if they were disposal times. That is survivorship bias: cases that settle or dispose
            early leave the pending pool, so the remaining stock is older than a random case. This
            version separates the two. Queue clearance is a system lower bound. Age bands are the age
            of the waiting stock. Neither is presented as a prediction for your case.
          </p>
        </div>

        <h2>1. Time: queue clearance, not a case duration</h2>
        <p>
          The time figure is a queue calculation, not a model of your case. It answers a narrow
          question: at the throughput NJDG recorded last month, how long would today&apos;s backlog
          take to clear if no new cases arrived?
        </p>
        <div className="formula-block">
          <strong>queueClearMonths</strong> = pendency ÷ disposals in the last month
          <br />
          <strong>monthsUsed</strong> = min(queueClearMonths, 120)
          <br />
          <strong>hearings</strong> = round(monthsUsed × hearings per month you enter)
        </div>
        <p>
          The 120-month cap is a presentation choice for the hearing count. It is shown on the
          statement. It does not mean the queue ends at 120 months.
        </p>

        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Bucket</th>
              <th scope="col" className="num">Pending</th>
              <th scope="col" className="num">Disposed last month</th>
              <th scope="col" className="num">Queue</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Civil</td>
              <td className="num">{num(SNAPSHOT.pendency.civil)}</td>
              <td className="num">{num(SNAPSHOT.disposedLastMonth.civil)}</td>
              <td className="num">{months(SNAPSHOT.pendency.civil / SNAPSHOT.disposedLastMonth.civil)}</td>
            </tr>
            <tr>
              <td>Criminal</td>
              <td className="num">{num(SNAPSHOT.pendency.criminal)}</td>
              <td className="num">{num(SNAPSHOT.disposedLastMonth.criminal)}</td>
              <td className="num">{months(SNAPSHOT.pendency.criminal / SNAPSHOT.disposedLastMonth.criminal)}</td>
            </tr>
            <tr>
              <td>Total</td>
              <td className="num">{num(SNAPSHOT.pendency.total)}</td>
              <td className="num">{num(SNAPSHOT.disposedLastMonth.total)}</td>
              <td className="num">{months(SNAPSHOT.pendency.total / SNAPSHOT.disposedLastMonth.total)}</td>
            </tr>
          </tbody>
        </table>
        <p className="section-note">
          Source: NJDG dated snapshot, fetched {SNAPSHOT.fetchedAt}. The live dashboard is parsed
          server-side at <a href={SNAPSHOT.source}>njdg.ecourts.gov.in</a> and cached for an hour; if
          the fetch fails, the dated snapshot is used and the banner says so.
        </p>

        <h3>Worked example</h3>
        <p>
          A ₹5,00,000 money recovery in Delhi, one hearing a month, one day lost per hearing, the
          default advocate and wage inputs, and the RBI repo rate:
        </p>
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Line</th>
              <th scope="col">Derivation</th>
              <th scope="col" className="num">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Queue</td>
              <td>{num(ex.pendency)} ÷ {num(ex.disposedPerMonth)}</td>
              <td className="num">{months(ex.queueClearMonths)}</td>
            </tr>
            <tr>
              <td>Hearings</td>
              <td>{months(ex.monthsUsed)} × 1 per month</td>
              <td className="num">{ex.hearings}</td>
            </tr>
            <tr>
              <td>Court fee</td>
              <td>Delhi Schedule I, Article 1: 3% of ₹5,00,000</td>
              <td className="num">{inr(ex.courtFee)}</td>
            </tr>
            <tr>
              <td>Advocate</td>
              <td>{inr(EXAMPLE_INPUT.advocatePerAppearance)} × {ex.hearings}</td>
              <td className="num">{inr(ex.advocateTotal)}</td>
            </tr>
            <tr>
              <td>Lost wages</td>
              <td>{inr(EXAMPLE_INPUT.dailyWage)} × {ex.hearings} × 1</td>
              <td className="num">{inr(ex.opportunityCost)}</td>
            </tr>
            <tr>
              <td>Cost of money</td>
              <td>₹5,00,000 × {EXAMPLE_INPUT.repoRate}% × {(ex.monthsUsed / 12).toFixed(2)} years</td>
              <td className="num">{inr(ex.interest)}</td>
            </tr>
            <tr>
              <td><strong>Total</strong></td>
              <td>{inr(ex.litigationCost)} litigation + {inr(ex.delayCost)} delay</td>
              <td className="num"><strong>{inr(ex.total)}</strong></td>
            </tr>
          </tbody>
        </table>
        <p className="section-note">
          The total is {pct(ex.shareOfClaim)} of the claim. The advocate line is the largest line, and
          it is the one legal aid can remove. That is why the legal-aid check is part of the model,
          not a footnote.
        </p>

        <h3>What NJDG does not publish</h3>
        <p>
          NJDG publishes counts and age bands for cases still pending. It does not publish how long
          disposed cases took. The P50/P75/P90 values on the home page are percentiles of the age of
          the pending stock, computed from the band midpoints (0.5, 2, 4, 7.5 and 12 years). They are
          labelled as such and are not used in the cost calculation. A case that settled in six
          months is not in the pool at all; using the pool as a disposal-time distribution would
          overstate the wait for routine matters and understate it for the tail.
        </p>

        <h3>Forum coverage</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Case type</th>
              <th scope="col">Forum</th>
              <th scope="col">NJDG coverage</th>
              <th scope="col">What the app does</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Family, property, money, commercial</td>
              <td>District civil court</td>
              <td>Civil bucket</td>
              <td>Uses the civil queue; labels the court level.</td>
            </tr>
            <tr>
              <td>Consumer</td>
              <td>Consumer Commission</td>
              <td>Not covered</td>
              <td>Shows the civil queue as a reference and says it is not a consumer-commission estimate.</td>
            </tr>
            <tr>
              <td>Cheque bounce (s.138)</td>
              <td>Magistrate</td>
              <td>Criminal bucket, not s.138-specific</td>
              <td>Shows the criminal queue as a broad reference and says so.</td>
            </tr>
            <tr>
              <td>Other criminal</td>
              <td>Magistrate / criminal court</td>
              <td>Criminal bucket</td>
              <td>Uses the criminal queue; no demand notice is generated.</td>
            </tr>
          </tbody>
        </table>

        <h3>Cohort mode</h3>
        <p>
          If <code>ECI_KEY</code> is set, the estimate route asks the eCourtsIndia partner adapter
          for disposed cases and computes filing-to-decision durations from fields the response
          actually contains. It needs at least five dated disposed rows; if the response shape does
          not contain them, it returns nothing and the app falls back to the labelled queue floor.
          It never fills a missing date. The cohort is a third-party dataset, not a government
          source, and the statement says so when it is used.
        </p>

        <h2>2. Cost: every line</h2>
        <h3>Court fee</h3>
        <p>
          Court fees are a State subject (Entry 3, State List). The parent Act is the Court Fees Act,
          1870. The app uses the State&apos;s own schedule for a money suit. It does not use a
          secondary calculator and it does not reuse a default for a State it has not sourced.
        </p>
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">State</th>
              <th scope="col">Act and section</th>
              <th scope="col">Money-suit rule</th>
              <th scope="col">Access</th>
            </tr>
          </thead>
          <tbody>
            {STATE_FEES.map((s) => (
              <tr key={s.state}>
                <td>{s.state}</td>
                <td>
                  {s.act}
                  <br />
                  <span className="muted">{s.section}</span>
                </td>
                <td>
                  {s.note}
                  <br />
                  <a href={s.url} target="_blank" rel="noreferrer">
                    Act text
                  </a>
                  {s.textUrl && (
                    <>
                      {" "}
                      <a href={s.textUrl} target="_blank" rel="noreferrer">
                        Schedule text
                      </a>
                    </>
                  )}
                </td>
                <td>{s.accessed}</td>
              </tr>
            ))}
            <tr>
              <td>{CENTRAL_FEE.state}</td>
              <td>
                {CENTRAL_FEE.act}
                <br />
                <span className="muted">{CENTRAL_FEE.section}</span>
              </td>
              <td>
                {CENTRAL_FEE.note}
                <br />
                <a href={CENTRAL_FEE.url} target="_blank" rel="noreferrer">
                  Act text
                </a>
              </td>
              <td>{CENTRAL_FEE.accessed}</td>
            </tr>
          </tbody>
        </table>
        <p>
          Any other State is shown as <strong>not yet sourced</strong>. The court fee is then
          excluded from the total, with a visible note, rather than filled with a default. The same
          applies to a s.138 complaint outside Delhi: the app only has the Delhi Article 3 rule, so it
          does not guess the other States&apos; criminal-complaint fee.
        </p>

        <h3>Consumer fee</h3>
        <p>
          A consumer complaint is not a civil suit. The fee follows rule 7(2) of the Consumer
          Protection (Consumer Disputes Redressal Commissions) Rules, 2020, as amended in 2023, and
          it is based on the value of the goods or services paid as consideration, not the
          compensation claimed. Up to ₹5,00,000 the fee is nil. The app uses that table and labels
          the forum as the Consumer Commission.
        </p>
        <p className="section-note">
          Source: {CONSUMER_FEE.act}, {CONSUMER_FEE.section}.{" "}
          <a href={CONSUMER_FEE.url} target="_blank" rel="noreferrer">
            Fee table
          </a>
          , accessed {CONSUMER_FEE.accessed}.
        </p>

        <h3>Advocate</h3>
        <p>
          There is no statutory advocate-fee schedule. The app does not invent a market rate. It
          starts at ₹9,000 per appearance, the Delhi State Legal Services Authority panel rate, and
          lets you replace it with your own quote. If you qualify for legal aid, the line is set to
          ₹0: NALSA&apos;s legal-aid FAQ says the fees of panel lawyers are borne by the legal
          services institutions. The panel rate is an anchor, not a quote for your case.
        </p>

        <h3>Lost wages</h3>
        <p>
          Opportunity cost = daily income × hearings × days lost per hearing. The default daily
          income is the VB-G RAM G national average of ₹{num(WAGE_SOURCE.nationalAverage)} per day
          (floor ₹{num(WAGE_SOURCE.floor)}). It is a rural employment-guarantee wage, so it is a
          floor for many urban and informal incomes; the input is editable and the fallback is
          labelled. Source: {WAGE_SOURCE.source}, accessed {WAGE_SOURCE.accessed}.
        </p>

        <h3>Cost of money</h3>
        <p>
          Money tied up in a claim is not free. The app uses the RBI policy repo rate as the
          risk-free anchor: claim × repo rate × years in the queue. This is a lower bound on the cost
          of capital; borrowing costs and a claimant&apos;s own opportunity cost are usually higher.
          It is not the interest a court may award at the end. The rate is editable.
        </p>
        <p className="section-note">
          Rate: {RBI.repoRate}% as of {RBI.asOf}. {RBI.source}{" "}
          <a href={RBI.url} target="_blank" rel="noreferrer">
            RBI release
          </a>
          , accessed {RBI.accessed}.
        </p>

        <h3>Hearings</h3>
        <p>
          NJDG does not publish hearings per case. The app derives hearings from the time figure and
          the hearings-per-month you enter. Both are visible. If your advocate charges a lump sum
          instead of a per-appearance fee, set the per-appearance fee to the lump sum and hearings to
          1, or adjust the hearings-per-month to match the real listing pattern.
        </p>

        <h2>3. Legal aid changes the total</h2>
        <p>
          Section 12 of the Legal Services Authorities Act, 1987 lists who is entitled to legal
          services. Section 13(1) makes it subject to the Authority being satisfied that there is a
          prima facie case. Section 13(2) says an affidavit of income is generally sufficient. A
          woman or child qualifies under s.12(c) irrespective of income.
        </p>
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Criterion</th>
              <th scope="col">Cite</th>
              <th scope="col">Income test?</th>
            </tr>
          </thead>
          <tbody>
            {LEGAL_AID_CATEGORIES.map((c) => (
              <tr key={c.id}>
                <td>{c.label}</td>
                <td>{c.cite}</td>
                <td>No</td>
              </tr>
            ))}
            <tr>
              <td>Annual income below the State ceiling</td>
              <td>s.12(h)</td>
              <td>Yes</td>
            </tr>
          </tbody>
        </table>
        <p>
          The income ceilings used are the NALSA compilation: Delhi ₹3,00,000; Maharashtra
          ₹3,00,000; Karnataka ₹3,00,000; Tamil Nadu ₹3,00,000. Delhi adds ₹4,00,000 for senior
          citizens and transgender persons, and no income test for acid-attack victims and persons
          affected by HIV. The Karnataka figure is disputed by the KSLSA FAQ, which still prints
          ₹1,00,000; the app uses the NALSA table and tells you to confirm with the DLSA.
        </p>
        <p>
          Legal aid sets the advocate line to ₹0. It does not automatically waive the court fee. If
          you cannot pay the fee, ask the DLSA about filing as an indigent person under Order XXXIII
          of the Code of Civil Procedure, 1908.
        </p>

        <h2>4. Alternatives</h2>
        <p>
          The alternatives panel is a set of statutory routes, not a recommendation. Each row states
          its basis, its statutory time limit, its cost, and a link. The app highlights a route based
          on the case type and value, but the final choice depends on facts a template cannot see.
        </p>
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Forum</th>
              <th scope="col">Statutory basis</th>
              <th scope="col">Time</th>
              <th scope="col">Cost</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Lok Adalat</td>
              <td>Legal Services Authorities Act, 1987, ss.19–21</td>
              <td>One sitting; no statutory outer limit</td>
              <td>No court fee; refund where a pending case is referred (s.21(1))</td>
            </tr>
            <tr>
              <td>Pre-institution mediation</td>
              <td>Commercial Courts Act, 2015, s.12A; PIMS Rules, 2018</td>
              <td>3 months + 2 months with consent</td>
              <td>₹1,000 application + Schedule II fee, shared equally</td>
            </tr>
            <tr>
              <td>Mediation Act, 2023</td>
              <td>ss.5, 18, 27</td>
              <td>120 days + 60 days by agreement</td>
              <td>No statutory fee; a DLSA/court-annexed centre may be free</td>
            </tr>
            <tr>
              <td>Compounding a s.138 complaint</td>
              <td>Negotiable Instruments Act, 1881, s.147; s.143A</td>
              <td>At any stage with court permission</td>
              <td>No statutory compounding fee; the settlement is the cheque amount</td>
            </tr>
          </tbody>
        </table>

        <h2>5. What this cannot tell you</h2>
        <ul>
          <li>
            <strong>Your case&apos;s disposal time.</strong> The queue is a system lower bound. A
            routine matter can dispose far sooner; a contested tail can run far longer.
          </li>
          <li>
            <strong>Whether you will win.</strong> The model prices time and cost, not merits. The
            cost of a loss (costs awarded against you, the claim itself) is not in the total.
          </li>
          <li>
            <strong>Consumer-commission or s.138-specific time.</strong> NJDG does not publish either
            series. The app shows the nearest bucket and labels it a reference.
          </li>
          <li>
            <strong>A State&apos;s court fee outside the four sourced States.</strong> It is marked
            not yet sourced and excluded from the total.
          </li>
          <li>
            <strong>Whether legal aid will be granted.</strong> Section 12 is an entitlement, but
            s.13(1) requires the Authority to be satisfied there is a prima facie case. Take the
            documents and ask.
          </li>
          <li>
            <strong>Market advocate fees.</strong> The ₹9,000 default is the Delhi panel rate. Your
            quote is the real input.
          </li>
        </ul>

        <h2>6. Data modes and access dates</h2>
        <ul>
          <li>
            <strong>NJDG:</strong> live HTML parsed server-side, cached for an hour, with a dated
            snapshot fallback. The estimate uses the dated snapshot so the arithmetic is
            reproducible; the banner shows whether the live fetch succeeded.
          </li>
          <li>
            <strong>eCourtsIndia:</strong> third-party, paid, key-gated. Without <code>ECI_KEY</code>{" "}
            the app runs in aggregate mode with a banner. It never scrapes services.ecourts.gov.in
            and never invents a CNR. With the key, cohort mode is attempted; if the response has no
            dated disposed rows, the app says so and uses the queue floor.
          </li>
          <li>
            <strong>OpenStreetMap:</strong> a cached snapshot of <code>amenity=courthouse</code>{" "}
            around four city centres, fetched through the Overpass API with mirror retries.
            Coordinates are copied from OSM; no location is inferred. The snapshot is not exhaustive.
          </li>
          <li>
            <strong>BharatCode:</strong> the adapter remains in <code>lib/bharatcode.ts</code>, but
            the decision flow does not paraphrase the numbers through a language model. The statement
            is deterministic. A model-written summary cannot introduce a rupee or a month that is not
            in the table.
          </li>
        </ul>
        <p>
          Every source with its URL and access date is on the <a href="/sources">sources page</a>.
        </p>
      </main>
    </>
  );
}
