"use client";

/** Last-resort boundary for errors in the root layout. Renders its own document and inline styles. */
export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="en-IN">
      <body style={{ margin: 0, minHeight: "100vh", display: "grid", placeItems: "center", background: "#070b14", color: "#fff", fontFamily: "system-ui, sans-serif" }}>
        <title>Something went wrong | Raghav Buildcon</title>
        <main style={{ maxWidth: 560, padding: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- global-error renders outside the app; keep it dependency-free */}
          <img src="/brand/raghav-buildcon-logo.png" alt="" width={72} height={72} />
          <p style={{ color: "#f2b04a", letterSpacing: "0.2em", fontSize: 12, fontWeight: 700, textTransform: "uppercase" }}>Raghav Buildcon</p>
          <h1 style={{ fontSize: 36, lineHeight: 1.1, margin: "16px 0" }}>Something went wrong.</h1>
          <p style={{ color: "#c9cfdb", lineHeight: 1.6 }}>An unexpected error occurred. Please try again.</p>
          {error.digest ? <p style={{ color: "#6b7891", fontSize: 12, fontFamily: "monospace" }}>Reference: {error.digest}</p> : null}
          <button
            type="button"
            onClick={() => retry()}
            style={{ marginTop: 24, background: "#e8962a", color: "#070b14", border: 0, borderRadius: 2, padding: "14px 24px", fontWeight: 700, cursor: "pointer" }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
