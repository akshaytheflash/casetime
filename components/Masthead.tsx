import { num } from "../lib/format";

export interface NjdgStatus {
  total: number;
  civil: number;
  disposed: number;
  fetchedAt: string;
  source: string;
}

export default function Masthead({
  njdg,
  eci = false,
}: {
  njdg?: NjdgStatus | null;
  eci?: boolean;
}) {
  const sourceLabel = njdg
    ? njdg.source === "live" || njdg.source === "cache"
      ? "NJDG live"
      : "NJDG snapshot"
    : "NJDG snapshot";

  return (
    <>
      <header className="masthead">
        <div className="shell masthead-inner">
          <a className="wordmark" href="/">
            Case<span>Time</span>
          </a>
          <p className="masthead-line">A cost statement for the queue</p>
          <nav className="masthead-nav" aria-label="Primary">
            <a href="/methodology">Methodology</a>
            <a href="/sources">Sources</a>
            <span>Data: 6 Nov 2026</span>
          </nav>
        </div>
      </header>
      <div className="mode-bar">
        <div className="shell">
          <span>
            {eci ? (
              <>
                <strong>Partner mode.</strong> Per-case eCourtsIndia lookup is configured. Estimates
                still show the aggregate fallback.
              </>
            ) : (
              <>
                <strong>Aggregate mode.</strong> Per-case eCourtsIndia lookup is not configured;
                estimates use NJDG aggregates only.
              </>
            )}
          </span>
          <span>
            {njdg
              ? `${sourceLabel}: ${num(njdg.total)} pending`
              : "NJDG dated snapshot: 5,21,19,188 pending"}
          </span>
        </div>
      </div>
    </>
  );
}
