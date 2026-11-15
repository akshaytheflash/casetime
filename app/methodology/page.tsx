import type { EstimateInput } from "../../lib/types";
import { estimate } from "../../lib/estimator";
import { inr, months, num, pct } from "../../lib/format";
import { CONSUMER_FEE, RBI, STATE_FEES, WAGE_SOURCE } from "../../lib/fees";
import { AID_CATEGORY_KEY, LEGAL_AID_CATEGORIES } from "../../lib/legalAid";
import { SNAPSHOT } from "../../lib/njdg";
import { getI18n } from "../../lib/i18n/server";
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
  const { t } = getI18n();
  const ex = estimate(EXAMPLE_INPUT);

  return (
    <>
      <Masthead />
      <main className="shell prose-page">
        <p>
          <a href="/">{t("common.backToEstimator")}</a>
        </p>
        <p className="hero-kicker" style={{ marginTop: 18 }}>
          {t("methodPage.kicker")}
        </p>
        <h1 className="display">{t("methodPage.title")}</h1>
        <p className="hero-deck">{t("methodPage.deck")}</p>

        <div className="callout callout-cost" style={{ marginTop: 24 }}>
          <p>
            <strong>{t("methodPage.correctionTitle")}</strong>{" "}
            {t("methodPage.correctionBody")}
          </p>
        </div>

        <h2>{t("methodPage.s1.title")}</h2>
        <p>{t("methodPage.s1.p1")}</p>
        <div className="formula-block">
          {t("methodPage.s1.formula1")}
          <br />
          {t("methodPage.s1.formula2")}
          <br />
          {t("methodPage.s1.formula3")}
        </div>
        <p>{t("methodPage.s1.p2")}</p>

        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">{t("methodPage.s1.colBucket")}</th>
              <th scope="col" className="num">
                {t("methodPage.s1.colPending")}
              </th>
              <th scope="col" className="num">
                {t("methodPage.s1.colDisposed")}
              </th>
              <th scope="col" className="num">
                {t("methodPage.s1.colQueue")}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{t("methodPage.s1.civil")}</td>
              <td className="num">{num(SNAPSHOT.pendency.civil)}</td>
              <td className="num">{num(SNAPSHOT.disposedLastMonth.civil)}</td>
              <td className="num">
                {months(SNAPSHOT.pendency.civil / SNAPSHOT.disposedLastMonth.civil)}
              </td>
            </tr>
            <tr>
              <td>{t("methodPage.s1.criminal")}</td>
              <td className="num">{num(SNAPSHOT.pendency.criminal)}</td>
              <td className="num">{num(SNAPSHOT.disposedLastMonth.criminal)}</td>
              <td className="num">
                {months(SNAPSHOT.pendency.criminal / SNAPSHOT.disposedLastMonth.criminal)}
              </td>
            </tr>
            <tr>
              <td>{t("methodPage.s1.total")}</td>
              <td className="num">{num(SNAPSHOT.pendency.total)}</td>
              <td className="num">{num(SNAPSHOT.disposedLastMonth.total)}</td>
              <td className="num">
                {months(SNAPSHOT.pendency.total / SNAPSHOT.disposedLastMonth.total)}
              </td>
            </tr>
          </tbody>
        </table>
        <p className="section-note">
          {t("methodPage.s1.source", { fetchedAt: SNAPSHOT.fetchedAt })}
        </p>

        <h3>{t("methodPage.worked.title")}</h3>
        <p>{t("methodPage.worked.intro")}</p>
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">{t("methodPage.worked.colLine")}</th>
              <th scope="col">{t("methodPage.worked.colDerivation")}</th>
              <th scope="col" className="num">
                {t("methodPage.worked.colValue")}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{t("methodPage.worked.queue")}</td>
              <td>
                {num(ex.pendency)} ÷ {num(ex.disposedPerMonth)}
              </td>
              <td className="num">{months(ex.queueClearMonths)}</td>
            </tr>
            <tr>
              <td>{t("methodPage.worked.hearings")}</td>
              <td>{t("methodPage.worked.hearingsDerivation", { months: months(ex.monthsUsed) })}</td>
              <td className="num">{ex.hearings}</td>
            </tr>
            <tr>
              <td>{t("methodPage.worked.courtFee")}</td>
              <td>{t("methodPage.worked.courtFeeDerivation")}</td>
              <td className="num">{inr(ex.courtFee)}</td>
            </tr>
            <tr>
              <td>{t("methodPage.worked.advocate")}</td>
              <td>
                {inr(EXAMPLE_INPUT.advocatePerAppearance)} × {ex.hearings}
              </td>
              <td className="num">{inr(ex.advocateTotal)}</td>
            </tr>
            <tr>
              <td>{t("methodPage.worked.wages")}</td>
              <td>
                {t("methodPage.worked.wagesDerivation", {
                  wage: inr(EXAMPLE_INPUT.dailyWage),
                  hearings: ex.hearings,
                })}
              </td>
              <td className="num">{inr(ex.opportunityCost)}</td>
            </tr>
            <tr>
              <td>{t("methodPage.worked.money")}</td>
              <td>
                {t("methodPage.worked.moneyDerivation", {
                  rate: EXAMPLE_INPUT.repoRate,
                  years: (ex.monthsUsed / 12).toFixed(2),
                })}
              </td>
              <td className="num">{inr(ex.interest)}</td>
            </tr>
            <tr>
              <td>
                <strong>{t("methodPage.worked.total")}</strong>
              </td>
              <td>
                {t("methodPage.worked.totalDerivation", {
                  litigation: inr(ex.litigationCost),
                  delay: inr(ex.delayCost),
                })}
              </td>
              <td className="num">
                <strong>{inr(ex.total)}</strong>
              </td>
            </tr>
          </tbody>
        </table>
        <p className="section-note">
          {t("methodPage.worked.caption", { share: pct(ex.shareOfClaim) })}
        </p>

        <h3>{t("methodPage.njdg.title")}</h3>
        <p>{t("methodPage.njdg.body")}</p>

        <h3>{t("methodPage.coverage.title")}</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">{t("methodPage.coverage.colCaseType")}</th>
              <th scope="col">{t("methodPage.coverage.colForum")}</th>
              <th scope="col">{t("methodPage.coverage.colCoverage")}</th>
              <th scope="col">{t("methodPage.coverage.colApp")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{t("methodPage.coverage.civilCase")}</td>
              <td>{t("methodPage.coverage.civilForum")}</td>
              <td>{t("methodPage.coverage.civilBucket")}</td>
              <td>{t("methodPage.coverage.civilApp")}</td>
            </tr>
            <tr>
              <td>{t("methodPage.coverage.consumer")}</td>
              <td>{t("methodPage.coverage.consumerForum")}</td>
              <td>{t("methodPage.coverage.notCovered")}</td>
              <td>{t("methodPage.coverage.consumerApp")}</td>
            </tr>
            <tr>
              <td>{t("methodPage.coverage.cheque")}</td>
              <td>{t("methodPage.coverage.magistrate")}</td>
              <td>{t("methodPage.coverage.criminalNotSpecific")}</td>
              <td>{t("methodPage.coverage.chequeApp")}</td>
            </tr>
            <tr>
              <td>{t("methodPage.coverage.criminal")}</td>
              <td>{t("methodPage.coverage.criminalForum")}</td>
              <td>{t("methodPage.coverage.criminalBucket")}</td>
              <td>{t("methodPage.coverage.criminalApp")}</td>
            </tr>
          </tbody>
        </table>

        <h3>{t("methodPage.cohort.title")}</h3>
        <p>{t("methodPage.cohort.body")}</p>

        <h2>{t("methodPage.s2.title")}</h2>
        <h3>{t("methodPage.courtFee.title")}</h3>
        <p>{t("methodPage.courtFee.body1")}</p>
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">{t("methodPage.courtFee.colState")}</th>
              <th scope="col">{t("methodPage.courtFee.colAct")}</th>
              <th scope="col">{t("methodPage.courtFee.colRule")}</th>
              <th scope="col">{t("methodPage.courtFee.colAccess")}</th>
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
                    {t("common.actText")}
                  </a>
                  {s.textUrl && (
                    <>
                      {" "}
                      <a href={s.textUrl} target="_blank" rel="noreferrer">
                        {t("common.scheduleText")}
                      </a>
                    </>
                  )}
                </td>
                <td>{s.accessed}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>{t("methodPage.courtFee.body2")}</p>

        <h3>{t("methodPage.consumer.title")}</h3>
        <p>{t("methodPage.consumer.body")}</p>
        <p className="section-note">
          {t("methodPage.consumer.source", {
            act: CONSUMER_FEE.act,
            section: CONSUMER_FEE.section,
            accessed: CONSUMER_FEE.accessed,
          })}{" "}
          <a href={CONSUMER_FEE.url} target="_blank" rel="noreferrer">
            {t("common.feeTable")}
          </a>
          .
        </p>

        <h3>{t("methodPage.advocate.title")}</h3>
        <p>{t("methodPage.advocate.body")}</p>

        <h3>{t("methodPage.wages.title")}</h3>
        <p>
          {t("methodPage.wages.body", {
            average: num(WAGE_SOURCE.nationalAverage),
            floor: num(WAGE_SOURCE.floor),
            source: WAGE_SOURCE.source,
            accessed: WAGE_SOURCE.accessed,
          })}
        </p>

        <h3>{t("methodPage.money.title")}</h3>
        <p>{t("methodPage.money.body")}</p>
        <p className="section-note">
          {t("methodPage.money.source", {
            rate: RBI.repoRate,
            asOf: RBI.asOf,
            source: RBI.source,
            accessed: RBI.accessed,
          })}{" "}
          <a href={RBI.url} target="_blank" rel="noreferrer">
            {t("common.rbiRelease")}
          </a>
          .
        </p>

        <h3>{t("methodPage.hearings.title")}</h3>
        <p>{t("methodPage.hearings.body")}</p>

        <h2>{t("methodPage.s3.title")}</h2>
        <p>{t("methodPage.s3.p1")}</p>
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">{t("methodPage.s3.colCriterion")}</th>
              <th scope="col">{t("methodPage.s3.colCite")}</th>
              <th scope="col">{t("methodPage.s3.colIncome")}</th>
            </tr>
          </thead>
          <tbody>
            {LEGAL_AID_CATEGORIES.map((c) => (
              <tr key={c.id}>
                <td>{AID_CATEGORY_KEY[c.id] ? t(AID_CATEGORY_KEY[c.id]) : c.label}</td>
                <td>{c.cite}</td>
                <td>{t("common.no")}</td>
              </tr>
            ))}
            <tr>
              <td>{t("methodPage.s3.incomeCeiling")}</td>
              <td>s.12(h)</td>
              <td>{t("common.yes")}</td>
            </tr>
          </tbody>
        </table>
        <p>{t("methodPage.s3.p2")}</p>
        <p>{t("methodPage.s3.p3")}</p>

        <h2>{t("methodPage.s4.title")}</h2>
        <p>{t("methodPage.s4.p1")}</p>
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">{t("methodPage.s4.colForum")}</th>
              <th scope="col">{t("methodPage.s4.colBasis")}</th>
              <th scope="col">{t("methodPage.s4.colTime")}</th>
              <th scope="col">{t("methodPage.s4.colCost")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{t("methodPage.s4.lokName")}</td>
              <td>{t("methodPage.s4.lokBasis")}</td>
              <td>{t("methodPage.s4.lokTime")}</td>
              <td>{t("methodPage.s4.lokCost")}</td>
            </tr>
            <tr>
              <td>{t("methodPage.s4.pimsName")}</td>
              <td>{t("methodPage.s4.pimsBasis")}</td>
              <td>{t("methodPage.s4.pimsTime")}</td>
              <td>{t("methodPage.s4.pimsCost")}</td>
            </tr>
            <tr>
              <td>{t("methodPage.s4.mediationName")}</td>
              <td>{t("methodPage.s4.mediationBasis")}</td>
              <td>{t("methodPage.s4.mediationTime")}</td>
              <td>{t("methodPage.s4.mediationCost")}</td>
            </tr>
            <tr>
              <td>{t("methodPage.s4.compoundName")}</td>
              <td>{t("methodPage.s4.compoundBasis")}</td>
              <td>{t("methodPage.s4.compoundTime")}</td>
              <td>{t("methodPage.s4.compoundCost")}</td>
            </tr>
          </tbody>
        </table>

        <h2>{t("methodPage.s5.title")}</h2>
        <ul>
          <li>{t("methodPage.s5.li1")}</li>
          <li>{t("methodPage.s5.li2")}</li>
          <li>{t("methodPage.s5.li3")}</li>
          <li>{t("methodPage.s5.li4")}</li>
          <li>{t("methodPage.s5.li5")}</li>
          <li>{t("methodPage.s5.li6")}</li>
        </ul>

        <h2>{t("methodPage.s6.title")}</h2>
        <ul>
          <li>{t("methodPage.s6.li1")}</li>
          <li>{t("methodPage.s6.li2")}</li>
          <li>{t("methodPage.s6.li3")}</li>
          <li>{t("methodPage.s6.li4")}</li>
        </ul>
        <p>
          <a href="/sources">{t("methodPage.s6.footer")}</a>
        </p>
      </main>
    </>
  );
}
