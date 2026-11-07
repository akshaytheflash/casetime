import type { EstimateResult } from "../lib/estimator";
import { osmLink, placesForState } from "../lib/places";

type Places = ReturnType<typeof placesForState>;

export default function PlacesSection({ result, places }: { result: EstimateResult; places: Places }) {
  const aid = result.legalAid;

  return (
    <section
      className="shell"
      style={{ paddingTop: 44, paddingBottom: 48, borderTop: "1px solid var(--rule-strong)" }}
      aria-labelledby="places-heading"
    >
      <div className="section-head">
        <div>
          <h2 className="h2" id="places-heading">
            Nearest help
          </h2>
          <p className="section-note">
            Courthouse locations are a cached OpenStreetMap snapshot. The DLSA is the free-help
            route; call before you travel.
          </p>
        </div>
      </div>

      <div className="places-grid">
        <div>
          <h3 className="h3" style={{ marginBottom: 8 }}>
            {places.city ? `Courthouses around ${places.city}` : "Courthouses"}
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
                      OSM {p.osmType}
                    </p>
                  </div>
                  <div className="place-distance">
                    {p.distanceKm < 1
                      ? `${Math.round(p.distanceKm * 1000)} m`
                      : `${p.distanceKm.toFixed(1)} km`}
                    <a href={osmLink(p)} target="_blank" rel="noreferrer">
                      Open in OSM
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="section-note">{places.note}</p>
          )}
          <p className="section-note" style={{ marginTop: 10 }}>
            {places.note} Snapshot fetched {new Date(places.fetchedAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
            .{" "}
            <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">
              OpenStreetMap licence
            </a>
            .
          </p>
        </div>

        <div className="aid-card">
          <h3 className="h3">Free legal help</h3>
          <p>
            <strong>{aid.authority.name}</strong>
          </p>
          <p>{aid.authority.note}</p>
          <p>
            The DLSA can assign a panel advocate, draft the plaint or complaint, and explain the
            court-fee position. If you meet a s.12 criterion, the advocate is free.
          </p>
          <div className="aid-actions">
            <a className="btn" href={aid.authority.url} target="_blank" rel="noreferrer">
              Find your DLSA
            </a>
            <a className="btn btn-secondary" href={aid.applyUrl} target="_blank" rel="noreferrer">
              Apply through NALSA
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
