"use client";

import { num } from "../lib/format";
import { useI18n } from "./I18nProvider";
import LanguageSwitcher from "./LanguageSwitcher";

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
  const { t } = useI18n();
  const sourceLabel = njdg
    ? njdg.source === "live" || njdg.source === "cache"
      ? t("masthead.njdgLive")
      : t("masthead.njdgSnapshot")
    : t("masthead.njdgSnapshot");

  return (
    <>
      <header className="masthead">
        <div className="shell masthead-inner">
          <a className="wordmark" href="/">
            Case<span>Time</span>
          </a>
          <p className="masthead-line">{t("masthead.tagline")}</p>
          <nav className="masthead-nav" aria-label={t("masthead.primaryNav")}>
            <a href="/methodology">{t("common.methodology")}</a>
            <a href="/sources">{t("common.sources")}</a>
            <span>{t("masthead.dataDate")}</span>
            <LanguageSwitcher />
          </nav>
        </div>
      </header>
      <div className="mode-bar">
        <div className="shell">
          <span>
            {eci ? t("masthead.mode.partner") : t("masthead.mode.aggregate")}
          </span>
          <span>
            {njdg
              ? t("masthead.pending", {
                  source: sourceLabel,
                  count: num(njdg.total),
                })
              : t("masthead.pendingFallback")}
          </span>
        </div>
      </div>
    </>
  );
}
