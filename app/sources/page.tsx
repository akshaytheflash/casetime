import Masthead from "../../components/Masthead";
import {
  ADVOCATE_SOURCES,
  CENTRAL_FEE,
  CONSUMER_FEE,
  RBI,
  STATE_FEES,
  WAGE_SOURCE,
} from "../../lib/fees";
import { LEGAL_AID_CATEGORIES, LEGAL_AID_META } from "../../lib/legalAid";
import { SNAPSHOT } from "../../lib/njdg";
import { OSM_SNAPSHOT_DATE } from "../../lib/places";
import { inr, num } from "../../lib/format";

export const metadata = { title: "CaseTime — Sources" };

export default function Sources() {
  return (
    <>
      <Masthead />
      <main className="shell prose-page">
        <p>
          <a href="/">Back to the estimator</a>
        </p>
        <p className="hero-kicker" style={{ marginTop: 18 }}>
          Sources
        </p>
        <h1 className="display">Every rupee and every month, with a link.</h1>
        <p className="hero-deck">
          This page is the audit trail. Each row names the instrument, the section, the URL and the
          access date. Where a State or a forum is not sourced, the row says so; the app does not fill
          the gap with a default.
        </p>

        <h2>Time and pendency</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Figure</th>
              <th scope="col">Value</th>
              <th scope="col">Source</th>
              <th scope="col">Access</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Pending, civil / criminal / total</td>
              <td>
                {num(SNAPSHOT.pendency.civil)} / {num(SNAPSHOT.pendency.criminal)} /{" "}
                {num(SNAPSHOT.pendency.total)}
              </td>
              <td>
                NJDG dashboard, parsed live server-side.{" "}
                <a href={SNAPSHOT.source} target="_blank" rel="noreferrer">
                  njdg.ecourts.gov.in
                </a>
                <br />
                <span className="muted">{SNAPSHOT.sourceNote}</span>
              </td>
              <td>{SNAPSHOT.fetchedAt}</td>
            </tr>
            <tr>
              <td>Disposed last month, civil / criminal</td>
              <td>
                {num(SNAPSHOT.disposedLastMonth.civil)} / {num(SNAPSHOT.disposedLastMonth.criminal)}
              </td>
              <td>Same NJDG dashboard.</td>
              <td>{SNAPSHOT.fetchedAt}</td>
            </tr>
            <tr>
              <td>Age bands (civil)</td>
              <td>
                {SNAPSHOT.ageBands.civil.map((n, i) => `${SNAPSHOT.ageBands.labels[i]}: ${num(n)}`).join("; ")}
              </td>
              <td>
                Same dashboard, <code>fetchYearData</code> band string. These are ages of cases still
                pending, not disposal times.
              </td>
              <td>{SNAPSHOT.fetchedAt}</td>
            </tr>
            <tr>
              <td>data.gov.in NJDG datasets</td>
              <td>Catalog linked, not embedded</td>
              <td>{SNAPSHOT.dataGovNote}</td>
              <td>{SNAPSHOT.fetchedAt}</td>
            </tr>
          </tbody>
        </table>

        <h2>Court fees: the Act, the section, the rule</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">State</th>
              <th scope="col">Act and section</th>
              <th scope="col">Money-suit rule (as read from the Act)</th>
              <th scope="col">Link</th>
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
                <td>{s.note}</td>
                <td>
                  <a href={s.url} target="_blank" rel="noreferrer">
                    Act
                  </a>
                  {s.textUrl && (
                    <>
                      <br />
                      <a href={s.textUrl} target="_blank" rel="noreferrer">
                        Schedule
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
              <td>{CENTRAL_FEE.note}</td>
              <td>
                <a href={CENTRAL_FEE.url} target="_blank" rel="noreferrer">
                  Act
                </a>
              </td>
              <td>{CENTRAL_FEE.accessed}</td>
            </tr>
            <tr>
              <td>Any other State</td>
              <td>Not yet sourced</td>
              <td className="unsourced">
                The app shows “not yet sourced” and excludes the court fee from the total. It does not
                reuse the central schedule as a default.
              </td>
              <td>—</td>
              <td>—</td>
            </tr>
          </tbody>
        </table>

        <h2>Consumer Commission fee</h2>
        <p>
          {CONSUMER_FEE.act}, {CONSUMER_FEE.section}. The fee follows the value of the goods or
          services paid as consideration, not the compensation claimed.{" "}
          <a href={CONSUMER_FEE.url} target="_blank" rel="noreferrer">
            Fee table
          </a>
          , accessed {CONSUMER_FEE.accessed}.
        </p>
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Value of goods or services paid as consideration</th>
              <th scope="col" className="num">Fee</th>
            </tr>
          </thead>
          <tbody>
            {CONSUMER_FEE.rule.type === "flat_slab" &&
              CONSUMER_FEE.rule.rows.map((r) => (
                <tr key={String(r.max)}>
                  <td>
                    {r.max === null
                      ? "Above ₹10,00,00,000"
                      : `Up to ${inr(r.max)}`}
                  </td>
                  <td className="num">{r.amount === 0 ? "Nil" : inr(r.amount)}</td>
                </tr>
              ))}
          </tbody>
        </table>
        <p className="section-note">{CONSUMER_FEE.note}</p>

        <h2>Legal aid</h2>
        <p>
          {LEGAL_AID_META.act}, {LEGAL_AID_META.section}.{" "}
          <a href={LEGAL_AID_META.url} target="_blank" rel="noreferrer">
            NALSA legal-aid page
          </a>{" "}
          and{" "}
          <a href={LEGAL_AID_META.textUrl} target="_blank" rel="noreferrer">
            Act text
          </a>
          , accessed 2026-11-06.
        </p>
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Criterion</th>
              <th scope="col">Cite</th>
            </tr>
          </thead>
          <tbody>
            {LEGAL_AID_CATEGORIES.map((c) => (
              <tr key={c.id}>
                <td>{c.label}</td>
                <td>{c.cite}</td>
              </tr>
            ))}
            <tr>
              <td>Annual income below the State ceiling</td>
              <td>s.12(h)</td>
            </tr>
          </tbody>
        </table>

        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">State</th>
              <th scope="col" className="num">Income ceiling</th>
              <th scope="col">Source</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(LEGAL_AID_META.income).map(([state, v]) => (
              <tr key={state}>
                <td>{state}</td>
                <td className="num">{inr(v.limit)}</td>
                <td>{v.source}</td>
              </tr>
            ))}
            <tr>
              <td>Delhi extras</td>
              <td className="num">₹4,00,000 for senior citizens and transgender persons</td>
              <td>{LEGAL_AID_META.income.Delhi.extra.map((e) => `${e.label} (${e.cite})`).join("; ")}</td>
            </tr>
            <tr>
              <td>Other States</td>
              <td className="num">Not stored</td>
              <td>
                The app says “no income ceiling stored for this State” and routes you to the DLSA.
              </td>
            </tr>
          </tbody>
        </table>

        <h2>Wages, advocate and interest</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Figure</th>
              <th scope="col">Value</th>
              <th scope="col">Source</th>
              <th scope="col">Access</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Daily wage, national average</td>
              <td>₹{num(WAGE_SOURCE.nationalAverage)}/day (floor ₹{num(WAGE_SOURCE.floor)})</td>
              <td>
                {WAGE_SOURCE.source}{" "}
                <a href={WAGE_SOURCE.url} target="_blank" rel="noreferrer">
                  PIB release
                </a>
              </td>
              <td>{WAGE_SOURCE.accessed}</td>
            </tr>
            {WAGE_SOURCE.stateWages.map((w) => (
              <tr key={w.state}>
                <td>{w.state} wage</td>
                <td>{w.wage ? `₹${num(w.wage)}/day` : "Band only"}</td>
                <td>{w.source}</td>
                <td>{WAGE_SOURCE.accessed}</td>
              </tr>
            ))}
            <tr>
              <td>Advocate, default anchor</td>
              <td>{inr(ADVOCATE_SOURCES.legalAidFloor.amount)} per {ADVOCATE_SOURCES.legalAidFloor.unit}</td>
              <td>{ADVOCATE_SOURCES.legalAidFloor.source}</td>
              <td>2026-11-06</td>
            </tr>
            <tr>
              <td>Advocate, legal-aid cover</td>
              <td>Panel lawyer fee borne by the legal services institution</td>
              <td>{ADVOCATE_SOURCES.legalAidCover.source}</td>
              <td>2026-11-06</td>
            </tr>
            <tr>
              <td>RBI policy repo rate</td>
              <td>{RBI.repoRate}%</td>
              <td>
                {RBI.source}{" "}
                <a href={RBI.url} target="_blank" rel="noreferrer">
                  RBI release
                </a>
              </td>
              <td>{RBI.accessed}</td>
            </tr>
          </tbody>
        </table>
        <p className="section-note">{RBI.note}</p>

        <h2>Alternatives</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Forum</th>
              <th scope="col">Statutory basis</th>
              <th scope="col">Time</th>
              <th scope="col">Link</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Lok Adalat</td>
              <td>Legal Services Authorities Act, 1987, ss.19–21</td>
              <td>One sitting; no statutory outer limit</td>
              <td>
                <a href="https://nalsa.gov.in/lok-adalats/" target="_blank" rel="noreferrer">
                  NALSA
                </a>
              </td>
            </tr>
            <tr>
              <td>Pre-institution mediation</td>
              <td>
                Commercial Courts Act, 2015, s.12A; Commercial Courts (Pre-Institution Mediation and
                Settlement) Rules, 2018, rr.3, 11 and Sch. II
              </td>
              <td>3 months + 2 months with consent</td>
              <td>
                <a href="https://nalsa.gov.in/pre-instituion-mediation/" target="_blank" rel="noreferrer">
                  NALSA
                </a>
                {" "}
                <a
                  href="https://ibclaw.in/the-commercial-courts-pre-institution-mediation-and-settlement-rules-2018/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Rules
                </a>
              </td>
            </tr>
            <tr>
              <td>Mediation Act, 2023</td>
              <td>ss.5, 18, 27</td>
              <td>120 days + 60 days by agreement</td>
              <td>
                <a
                  href="https://upload.indiacode.nic.in/view-casepdf?id=AC_CEN_3_46_00011_A2023-32_1697800640677&type=act"
                  target="_blank"
                  rel="noreferrer"
                >
                  Act PDF
                </a>
              </td>
            </tr>
            <tr>
              <td>Compounding a s.138 complaint</td>
              <td>Negotiable Instruments Act, 1881, s.147; s.143A</td>
              <td>At any stage with court permission</td>
              <td>
                <a href="https://devgan.in/nia/section/147/" target="_blank" rel="noreferrer">
                  s.147
                </a>
              </td>
            </tr>
          </tbody>
        </table>

        <h2>Places</h2>
        <p>
          Courthouse locations are a cached OpenStreetMap snapshot fetched through the Overpass API
          on {OSM_SNAPSHOT_DATE}. The fetch script tries three mirrors and keeps the previous cache
          for a city if every mirror fails. Coordinates are copied from OSM; no location is inferred.
          The snapshot covers four city centres and is not exhaustive.{" "}
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">
            OpenStreetMap licence (ODbL 1.0)
          </a>
          .
        </p>

        <h2>Partner and model adapters</h2>
        <ul>
          <li>
            <strong>eCourtsIndia partner API</strong> — third-party, paid, key-gated.{" "}
            <code>GET /api/partner/v2/search</code>, <code>GET /api/partner/case/&#123;cnr&#125;</code>
            . Without <code>ECI_KEY</code> the app runs in aggregate mode with a banner. CNRs come
            from search results only; the app never invents a CNR and never scrapes
            services.ecourts.gov.in.
          </li>
          <li>
            <strong>BharatCode</strong> — the adapter remains in <code>lib/bharatcode.ts</code> for
            optional plain-language summaries, but the decision flow does not paraphrase the numbers
            through a model. The statement is deterministic.
          </li>
        </ul>

        <p className="section-note">
          All sources were accessed on 6 November 2026 unless the row states a different date. The
          NJDG snapshot was fetched on {SNAPSHOT.fetchedAt}. Act texts can be amended; check the
          current text before filing.
        </p>
      </main>
    </>
  );
}
