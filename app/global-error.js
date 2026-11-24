"use client";

// Last-resort boundary when the root layout itself fails; must render its own <html>.
export default function GlobalError({ reset }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: "100vh", display: "grid", placeItems: "center", background: "#f8fafc", color: "#475569", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ textAlign: "center", padding: 24 }}>
          <p style={{ letterSpacing: "0.3em", fontSize: 12, color: "#1d4ed8", textTransform: "uppercase" }}>Critical error</p>
          <h1 style={{ margin: "12px 0", color: "#0f172a" }}>Job Matcher failed to load</h1>
          <p style={{ color: "#64748b" }}>Please refresh the page.</p>
          <button
            type="button"
            onClick={reset}
            style={{ marginTop: 20, padding: "10px 18px", borderRadius: 12, border: 0, background: "#1d4ed8", color: "#ffffff", fontWeight: 700, cursor: "pointer" }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
