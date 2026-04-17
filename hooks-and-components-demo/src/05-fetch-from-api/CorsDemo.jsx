// =======================================================
//  VISUAL CORS DEMO
//  Shows ALLOWED vs BLOCKED side by side in the UI
// =======================================================

import { useState } from "react";

// ── Each scenario card ──
function ScenarioCard({ title, description, buttonLabel, color, onFetch }) {
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleFetch() {
    setLoading(true);
    setResult(null);
    const res = await onFetch();
    setResult(res);
    setLoading(false);
  }

  const borderColor = result
    ? result.success ? "#52c41a" : "#ff4d4f"
    : "#ddd";

  return (
    <div style={{ ...styles.card, borderTop: `4px solid ${color}`, borderColor }}>
      <h3 style={{ color, margin: "0 0 6px" }}>{title}</h3>
      <p style={styles.desc}>{description}</p>

      <button onClick={handleFetch} style={{ ...styles.btn, background: color }}>
        {loading ? "Fetching..." : buttonLabel}
      </button>

      {result && (
        <div style={{
          ...styles.result,
          background: result.success ? "#f6ffed" : "#fff2f0",
          border: `1px solid ${result.success ? "#b7eb8f" : "#ffccc7"}`,
        }}>
          {result.success ? (
            <>
              <p style={{ color: "#52c41a", fontWeight: 700 }}>ALLOWED</p>
              <p>{result.message}</p>
              <p style={styles.hint}>Origin matched → browser let it through</p>
            </>
          ) : (
            <>
              <p style={{ color: "#ff4d4f", fontWeight: 700 }}>BLOCKED</p>
              <p>{result.message}</p>
              <p style={styles.hint}>Origin mismatch → browser killed the request</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main demo ──
function CorsDemo() {
  // Scenario 1 — correct origin → ALLOWED
  async function fetchAllowed() {
    try {
      const res  = await fetch("http://localhost:5000/api/cors-demo/allowed");
      const data = await res.json();
      return { success: true, message: data.message };
    } catch {
      return { success: false, message: "Request was blocked by CORS policy." };
    }
  }

  // Scenario 2 — wrong origin → BLOCKED
  async function fetchBlocked() {
    try {
      const res  = await fetch("http://localhost:5000/api/cors-demo/blocked");
      const data = await res.json();
      return { success: true, message: data.message };
    } catch {
      return { success: false, message: "Request was blocked by CORS policy." };
    }
  }

  return (
    <div style={styles.page}>
      <h2>CORS Visual Demo</h2>
      <p style={styles.subtitle}>
        Both buttons call the same Express server (port 5000).<br />
        The difference is the <strong>origin</strong> the server allows.
      </p>

      {/* How it works diagram */}
      <div style={styles.diagram}>
        <div style={styles.diagramBox}>React App<br /><small>localhost:3000</small></div>
        <div style={styles.arrow}>fetch() →</div>
        <div style={styles.diagramBox}>Express API<br /><small>localhost:5000</small></div>
        <div style={styles.arrow}>← checks origin</div>
        <div style={styles.diagramBox}>Browser<br /><small>enforces CORS</small></div>
      </div>

      <div style={styles.grid}>
        <ScenarioCard
          title="Allowed"
          color="#52c41a"
          description='Server allows origin "localhost:3000" → matches React → passes'
          buttonLabel="Fetch (Allowed)"
          onFetch={fetchAllowed}
        />
        <ScenarioCard
          title="Blocked"
          color="#ff4d4f"
          description='Server allows only "localhost:9999" → does NOT match → blocked'
          buttonLabel="Fetch (Blocked)"
          onFetch={fetchBlocked}
        />
      </div>

      <div style={styles.rule}>
        <strong>Rule:</strong> If <code>Access-Control-Allow-Origin</code> on the server
        does not match the origin of the React app — the browser blocks the response.
        The request reaches the server, but the browser hides the response from JS.
      </div>
    </div>
  );
}

const styles = {
  page:       { padding: 24 },
  subtitle:   { color: "#555", marginBottom: 24, lineHeight: 1.6 },
  grid:       { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 },
  card:       { border: "1px solid #ddd", borderRadius: 8, padding: 20 },
  desc:       { color: "#666", fontSize: 13, marginBottom: 12 },
  btn:        { color: "#fff", border: "none", padding: "8px 18px", borderRadius: 6, cursor: "pointer", fontSize: 14 },
  result:     { marginTop: 16, padding: 14, borderRadius: 6 },
  hint:       { fontSize: 12, color: "#888", margin: 0 },
  diagram:    { display: "flex", alignItems: "center", gap: 8, marginBottom: 24, background: "#fafafa", padding: 16, borderRadius: 8 },
  diagramBox: { background: "#fff", border: "1px solid #ddd", borderRadius: 6, padding: "8px 14px", textAlign: "center", fontSize: 13 },
  arrow:      { color: "#888", fontSize: 13 },
  rule:       { background: "#fffbe6", border: "1px solid #ffe58f", borderRadius: 8, padding: 16, fontSize: 13, lineHeight: 1.6 },
};

export default CorsDemo;