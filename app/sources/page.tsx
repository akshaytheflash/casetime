import Masthead from "../../components/Masthead";
import {
  ADVOCATE_SOURCES,
  CENTRAL_FEE,
  CONSUMER_FEE,
  RBI,
  STATE_FEES,
  WAGE_SOURCE,
} from "../../lib/fees";
import {
  AID_CATEGORY_KEY,
  LEGAL_AID_CATEGORIES,
  LEGAL_AID_META,
} from "../../lib/legalAid";
import { SNAPSHOT } from "../../lib/njdg";
import { OSM_SNAPSHOT_DATE } from "../../lib/places";
import { inr, num } from "../../lib/format";
import type { MessageKey } from "../../lib/i18n/messages/en";
import { getI18n } from "../../lib/i18n/server";

export const metadata = { title: "CaseTime — Sources" };

const AGE_BAND_KEY: Record<string, MessageKey> = {
  "<1 year": "band.age.lessThan1",
  "1-3 years": "band.age.1to3",
  "3-5 years": "band.age.3to5",
  "5-10 years": "band.age.5to10",
  ">10 years": "band.age.moreThan10",
};

export default function Sources() {
  const { t } = getI18n();

  return (
    <>
      <Masthead />
      <main className="shell prose-page">
        <p>
          <a href="/">{t("common.backToEstimator")}</a>
        </p>
        <p className="hero-kicker" style={{ marginTop: 18 }}>
          {t("sourcesPage.kicker")}
        </p>
        <h1 className="display">{t("sourcesPage.title")}</h1>
        <p className="hero-deck">{t("sourcesPage.deck")}</p>

        <h2>{t("sourcesPage.time.title")}</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">{t("sourcesPage.colFigure")}</th>
              <th scope="col">{t("sourcesPage.colValue")}</th>
              <th scope="col">{t("sourcesPage.colSource")}</th>
              <th scope="col">{t("sourcesPage.colAccess")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{t("sourcesPage.pending")}</td>
              <td>
                {num(SNAPSHOT.pendency.civil)} / {num(SNAPSHOT.pendency.criminal)} /{" "}
                {num(SNAPSHOT.pendency.total)}
              </td>
              <td>
                {t("sourcesPage.njdgParsed")}{" "}
                <a href={SNAPSHOT.source} target="_blank" rel="noreferrer">
                  njdg.ecourts.gov.in
                </a>
                <br />
                <span className="muted">{t("sourcesPage.njdgSourceNote")}</span>
              </td>
              <td>{SNAPSHOT.fetchedAt}</td>
            </tr>
            <tr>
              <td>{t("sourcesPage.disposed")}</td>
              <td>
                {num(SNAPSHOT.disposedLastMonth.civil)} /{" "}
                {num(SNAPSHOT.disposedLastMonth.criminal)}
              </td>
              <td>{t("sourcesPage.sameDashboard")}</td>
              <td>{SNAPSHOT.fetchedAt}</td>
            </tr>
            <tr>
              <td>{t("sourcesPage.ageBands")}</td>
              <td>
                {SNAPSHOT.ageBands.civil
                  .map((n, i) => {
                    const label = SNAPSHOT.ageBands.labels[i];
                    return `${AGE_BAND_KEY[label] ? t(AGE_BAND_KEY[label]) : label}: ${num(n)}`;
                  })
                  .join("; ")}
              </td>
              <td>{t("sourcesPage.ageBandsSource")}</td>
              <td>{SNAPSHOT.fetchedAt}</td>
            </tr>
            <tr>
              <td>{t("sourcesPage.dataGov")}</td>
              <td>{t("sourcesPage.catalogLinked")}</td>
              <td>{t("sourcesPage.dataGovNote")}</td>
              <td>{SNAPSHOT.fetchedAt}</td>
            </tr>
          </tbody>
        </table>

        <h2>{t("sourcesPage.fees.title")}</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">{t("sourcesPage.colState")}</th>
              <th scope="col">{t("sourcesPage.colAct")}</th>
              <th scope="col">{t("sourcesPage.colRule")}</th>
              <th scope="col">{t("sourcesPage.colLink")}</th>
              <th scope="col">{t("sourcesPage.colAccess")}</th>
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
                    {t("common.act")}
                  </a>
                  {s.textUrl && (
                    <>
                      <br />
                      <a href={s.textUrl} target="_blank" rel="noreferrer">
                        {t("common.schedule")}
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
                  {t("common.act")}
                </a>
              </td>
              <td>{CENTRAL_FEE.accessed}</td>
            </tr>
            <tr>
              <td>{t("sourcesPage.otherState")}</td>
              <td>{t("common.notYetSourced")}</td>
              <td className="unsourced">{t("sourcesPage.otherStateRule")}</td>
              <td>—</td>
              <td>—</td>
            </tr>
          </tbody>
        </table>

        <h2>{t("sourcesPage.consumer.title")}</h2>
        <p>
          {t("sourcesPage.consumer.body", {
            act: CONSUMER_FEE.act,
            section: CONSUMER_FEE.section,
            accessed: CONSUMER_FEE.accessed,
          })}{" "}
          <a href={CONSUMER_FEE.url} target="_blank" rel="noreferrer">
            {t("common.feeTable")}
          </a>
          .
        </p>
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">{t("sourcesPage.consumer.colValue")}</th>
              <th scope="col" className="num">
                {t("sourcesPage.consumer.colFee")}
              </th>
            </tr>
          </thead>
          <tbody>
            {CONSUMER_FEE.rule.type === "flat_slab" &&
              CONSUMER_FEE.rule.rows.map((r) => (
                <tr key={String(r.max)}>
                  <td>
                    {r.max === null
                      ? t("sourcesPage.consumer.above")
                      : t("sourcesPage.consumer.upTo", { amount: inr(r.max) })}
                  </td>
                  <td className="num">
                    {r.amount === 0 ? t("sourcesPage.consumer.nil") : inr(r.amount)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <p className="section-note">{t("sourcesPage.consumer.note")}</p>

        <h2>{t("sourcesPage.legalAid.title")}</h2>
        <p>
          {t("sourcesPage.legalAid.body", {
            act: LEGAL_AID_META.act,
            section: LEGAL_AID_META.section,
          })}{" "}
          <a href={LEGAL_AID_META.url} target="_blank" rel="noreferrer">
            {t("common.nalsaPage")}
          </a>{" "}
          ·{" "}
          <a href={LEGAL_AID_META.textUrl} target="_blank" rel="noreferrer">
            {t("common.actText")}
          </a>
        </p>
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">{t("sourcesPage.legalAid.colCriterion")}</th>
              <th scope="col">{t("sourcesPage.legalAid.colCite")}</th>
            </tr>
          </thead>
          <tbody>
            {LEGAL_AID_CATEGORIES.map((c) => (
              <tr key={c.id}>
                <td>{AID_CATEGORY_KEY[c.id] ? t(AID_CATEGORY_KEY[c.id]) : c.label}</td>
                <td>{c.cite}</td>
              </tr>
            ))}
            <tr>
              <td>{t("sourcesPage.legalAid.incomeCeiling")}</td>
              <td>s.12(h)</td>
            </tr>
          </tbody>
        </table>

        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">{t("sourcesPage.legalAid.colIncomeState")}</th>
              <th scope="col" className="num">
                {t("sourcesPage.legalAid.colIncomeLimit")}
              </th>
              <th scope="col">{t("sourcesPage.colSource")}</th>
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
              <td>{t("sourcesPage.legalAid.delhiExtras")}</td>
              <td className="num">{t("sourcesPage.legalAid.delhiExtrasValue")}</td>
              <td>
                {LEGAL_AID_META.income.Delhi.extra
                  .map(
                    (e) =>
                      `${AID_CATEGORY_KEY[e.id] ? t(AID_CATEGORY_KEY[e.id]) : e.label} (${e.cite})`
                  )
                  .join("; ")}
              </td>
            </tr>
            <tr>
              <td>{t("sourcesPage.legalAid.otherStates")}</td>
              <td className="num">{t("common.notStored")}</td>
              <td>{t("sourcesPage.legalAid.otherStatesRule")}</td>
            </tr>
          </tbody>
        </table>

        <h2>{t("sourcesPage.wages.title")}</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">{t("sourcesPage.colFigure")}</th>
              <th scope="col">{t("sourcesPage.colValue")}</th>
              <th scope="col">{t("sourcesPage.colSource")}</th>
              <th scope="col">{t("sourcesPage.colAccess")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{t("sourcesPage.wages.daily")}</td>
              <td>
                {t("sourcesPage.wages.dailyValue", {
                  average: `₹${num(WAGE_SOURCE.nationalAverage)}`,
                  floor: `₹${num(WAGE_SOURCE.floor)}`,
                })}
              </td>
              <td>
                {WAGE_SOURCE.source}{" "}
                <a href={WAGE_SOURCE.url} target="_blank" rel="noreferrer">
                  {t("common.pibRelease")}
                </a>
              </td>
              <td>{WAGE_SOURCE.accessed}</td>
            </tr>
            {WAGE_SOURCE.stateWages.map((w) => (
              <tr key={w.state}>
                <td>{t("sourcesPage.wages.stateWage", { state: w.state })}</td>
                <td>
                  {w.wage
                    ? `₹${num(w.wage)}/day`
                    : t("sourcesPage.wages.bandOnly")}
                </td>
                <td>{w.source}</td>
                <td>{WAGE_SOURCE.accessed}</td>
              </tr>
            ))}
            <tr>
              <td>{t("sourcesPage.wages.advocateDefault")}</td>
              <td>
                {t("sourcesPage.wages.perAppearance", {
                  amount: inr(ADVOCATE_SOURCES.legalAidFloor.amount),
                })}
              </td>
              <td>{ADVOCATE_SOURCES.legalAidFloor.source}</td>
              <td>2026-11-06</td>
            </tr>
            <tr>
              <td>{t("sourcesPage.wages.advocateCover")}</td>
              <td>{t("sourcesPage.wages.advocateCoverValue")}</td>
              <td>{ADVOCATE_SOURCES.legalAidCover.source}</td>
              <td>2026-11-06</td>
            </tr>
            <tr>
              <td>{t("sourcesPage.wages.repo")}</td>
              <td>{RBI.repoRate}%</td>
              <td>
                {RBI.source}{" "}
                <a href={RBI.url} target="_blank" rel="noreferrer">
                  {t("common.rbiRelease")}
                </a>
              </td>
              <td>{RBI.accessed}</td>
            </tr>
          </tbody>
        </table>
        <p className="section-note">{t("sourcesPage.wages.rbiNote")}</p>

        <h2>{t("sourcesPage.alternatives.title")}</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">{t("sourcesPage.alternatives.colForum")}</th>
              <th scope="col">{t("sourcesPage.alternatives.colBasis")}</th>
              <th scope="col">{t("sourcesPage.alternatives.colTime")}</th>
              <th scope="col">{t("sourcesPage.alternatives.colLink")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{t("sourcesPage.alternatives.lokName")}</td>
              <td>{t("sourcesPage.alternatives.lokBasis")}</td>
              <td>{t("sourcesPage.alternatives.lokTime")}</td>
              <td>
                <a href="https://nalsa.gov.in/lok-adalats/" target="_blank" rel="noreferrer">
                  NALSA
                </a>
              </td>
            </tr>
            <tr>
              <td>{t("sourcesPage.alternatives.pimsName")}</td>
              <td>{t("sourcesPage.alternatives.pimsBasis")}</td>
              <td>{t("sourcesPage.alternatives.pimsTime")}</td>
              <td>
                <a
                  href="https://nalsa.gov.in/pre-instituion-mediation/"
                  target="_blank"
                  rel="noreferrer"
                >
                  NALSA
                </a>{" "}
                <a
                  href="https://ibclaw.in/the-commercial-courts-pre-institution-mediation-and-settlement-rules-2018/"
                  target="_blank"
                  rel="noreferrer"
                >
                  {t("common.rules")}
                </a>
              </td>
            </tr>
            <tr>
              <td>{t("sourcesPage.alternatives.mediationName")}</td>
              <td>{t("sourcesPage.alternatives.mediationBasis")}</td>
              <td>{t("sourcesPage.alternatives.mediationTime")}</td>
              <td>
                <a
                  href="https://upload.indiacode.nic.in/view-casepdf?id=AC_CEN_3_46_00011_A2023-32_1697800640677&type=act"
                  target="_blank"
                  rel="noreferrer"
                >
                  {t("common.actPdf")}
                </a>
              </td>
            </tr>
            <tr>
              <td>{t("sourcesPage.alternatives.compoundName")}</td>
              <td>{t("sourcesPage.alternatives.compoundBasis")}</td>
              <td>{t("sourcesPage.alternatives.compoundTime")}</td>
              <td>
                <a href="https://devgan.in/nia/section/147/" target="_blank" rel="noreferrer">
                  s.147
                </a>
              </td>
            </tr>
          </tbody>
        </table>

        <h2>{t("sourcesPage.places.title")}</h2>
        <p>
          {t("sourcesPage.places.body", { date: OSM_SNAPSHOT_DATE })}{" "}
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">
            {t("places.licence")}
          </a>
          .
        </p>

        <h2>{t("sourcesPage.adapters.title")}</h2>
        <ul>
          <li>{t("sourcesPage.adapters.eci")}</li>
          <li>{t("sourcesPage.adapters.bharatcode")}</li>
        </ul>

        <p className="section-note">
          {t("sourcesPage.footer", { date: SNAPSHOT.fetchedAt })}
        </p>
      </main>
    </>
  );
}
