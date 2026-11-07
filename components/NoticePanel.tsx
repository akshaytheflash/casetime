"use client";

import { useState } from "react";
import type { GeneratedNotice } from "../lib/notice";

export default function NoticePanel({ notice }: { notice: GeneratedNotice }) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(notice.body);
      setCopied(true);
      setCopyError(false);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      try {
        const ta = document.createElement("textarea");
        ta.value = notice.body;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        setCopied(true);
        setCopyError(false);
        window.setTimeout(() => setCopied(false), 2200);
      } catch {
        setCopyError(true);
      }
    }
  }

  function download() {
    const blob = new Blob([notice.body], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "casetime-notice.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <section
      className="shell"
      style={{ paddingTop: 44, paddingBottom: 48, borderTop: "1px solid var(--rule-strong)" }}
      aria-labelledby="notice-heading"
    >
      <div className="section-head">
        <div>
          <h2 className="h2" id="notice-heading">
            The notice you can send
          </h2>
          <p className="section-note">
            A generated draft with bracketed fields. It is a starting point for a DLSA panel lawyer,
            not a filing-ready document.
          </p>
        </div>
      </div>

      <div className="notice-grid">
        <div>
          <h3 className="h3" style={{ marginBottom: 6 }}>
            {notice.title}
          </h3>
          <p className="notice-basis">
            {notice.basis}{" "}
            <a href={notice.basisUrl} target="_blank" rel="noreferrer">
              Read the provision
            </a>
          </p>
          <pre className="notice-pre" tabIndex={0} aria-label="Draft notice text">
            {notice.body}
          </pre>
          <div className="notice-actions">
            <button className="btn btn-small" type="button" onClick={copy}>
              {copied ? "Copied" : "Copy notice"}
            </button>
            <button className="btn btn-secondary btn-small" type="button" onClick={download}>
              Download .txt
            </button>
            {copyError && (
              <span className="section-note" style={{ color: "var(--cost-deep)" }} role="alert">
                Copy failed. Select the text and copy it manually.
              </span>
            )}
          </div>
          <p className="section-note" style={{ marginTop: 10 }}>
            Replace every bracketed field. Do not send a notice with a placeholder left in it. Keep
            proof of dispatch and a copy.
          </p>
        </div>

        <aside>
          <h3 className="h3" style={{ marginBottom: 8 }}>
            Before you send it
          </h3>
          <ol className="notice-steps">
            {notice.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          <div className="callout callout-sage" style={{ marginTop: 14 }}>
            <p>
              A notice is a legal step with consequences. Have a DLSA panel lawyer read it, especially
              the limitation date and the demand.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
