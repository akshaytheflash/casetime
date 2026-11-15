"use client";

import type { EstimateResult } from "../lib/estimator";
import type { MessageKey } from "../lib/i18n/messages/en";
import { osmLink, placesForState } from "../lib/places";
import { useI18n } from "./I18nProvider";

type Places = ReturnType<typeof placesForState>;

const AUTHORITY_NOTE_KEY: Record<string, MessageKey> = {
  "Delhi State Legal Services Authority (DSLSA)": "aid.authority.delhi",
  "Maharashtra State Legal Services Authority (MSLSA)": "aid.authority.maharashtra",
  "Karnataka State Legal Services Authority (KSLSA)": "aid.authority.karnataka",
  "Tamil Nadu State Legal Services Authority (TNSLSA)": "aid.authority.tamilNadu",
  "National Legal Services Authority (NALSA)": "aid.authority.nalsa",
};

export default function PlacesSection({
  result,
  places,
  state,
}: {
  result: EstimateResult;
  places: Places;
  state?: string;
}) {
  const { t } = useI18n();
  const aid = result.legalAid;
  const stateLabel =
    state === "Other" ? t("hero.thisState") : state ?? places.city ?? "";

  return (
    <section
      className="shell"
      style={{ paddingTop: 44, paddingBottom: 48, borderTop: "1px solid var(--rule-strong)" }}
      aria-labelledby="places-heading"
    >
      <div className="section-head">
        <div>
          <h2 className="h2" id="places-heading">
            {t("places.heading")}
          </h2>
          <p className="section-note">{t("places.intro")}</p>
        </div>
      </div>

      <div className="places-grid">
        <div>
          <h3 className="h3" style={{ marginBottom: 8 }}>
            {places.city ? t("places.around", { city: places.city }) : t("places.courthouses")}
          </h3>
          {places.places.length > 0 ? (
            <ul className="place-list">
              {places.places.map((p) => (
                <li key={p.id}>
                  <div>
                    <p className="place-name">{p.name}</p>
                    <p className="place-meta">
                      {p.tags["addr:street"] ? `${p.tags["addr:street"]} · ` : ""}
                      {p.tags.operator ? `${p.tags.operator} · ` : ""}
                      {t("places.osmType", { type: p.osmType })}
                    </p>
                  </div>
                  <div className="place-distance">
                    {p.distanceKm < 1
                      ? t("places.metres", { distance: Math.round(p.distanceKm * 1000) })
                      : t("places.kilometres", { distance: p.distanceKm.toFixed(1) })}
                    <a href={osmLink(p)} target="_blank" rel="noreferrer">
                      {t("places.openOsm")}
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="section-note">{t("places.empty", { state: stateLabel })}</p>
          )}
          <p className="section-note" style={{ marginTop: 10 }}>
            {t("places.note")}{" "}
            {t("places.snapshot", {
              date: new Date(places.fetchedAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }),
            })}{" "}
            <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">
              {t("places.licence")}
            </a>
            .
          </p>
        </div>

        <div className="aid-card">
          <h3 className="h3">{t("places.help")}</h3>
          <p>
            <strong>{aid.authority.name}</strong>
          </p>
          <p>
            {AUTHORITY_NOTE_KEY[aid.authority.name]
              ? t(AUTHORITY_NOTE_KEY[aid.authority.name])
              : aid.authority.note}
          </p>
          <p>{t("places.helpBody")}</p>
          <div className="aid-actions">
            <a className="btn" href={aid.authority.url} target="_blank" rel="noreferrer">
              {t("aid.findDlsa")}
            </a>
            <a className="btn btn-secondary" href={aid.applyUrl} target="_blank" rel="noreferrer">
              {t("aid.applyNalsa")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
