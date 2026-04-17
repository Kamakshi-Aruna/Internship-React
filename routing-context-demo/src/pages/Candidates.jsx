// =======================================================
//  PAGE: Candidates  (with nested route for detail)
// =======================================================
//
//  React Router v6 nested routes:
//  - /candidates          → shows the list
//  - /candidates/:id      → shows detail for one candidate
//
//  useParams()  → reads the :id from the URL
//  <Outlet />   → where the nested route renders inside the parent
//  <Link />     → navigates without full page reload
// =======================================================

import { Link, Outlet, useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import StatusWrapper from "../components/StatusWrapper";

// ── Nested route: /candidates/:id ──
export function CandidateDetail() {
  const { id } = useParams();                          // read :id from URL
  const { candidates } = useAppContext();
  const candidate = candidates.find((c) => c.id === Number(id));

  if (!candidate) return <p>Candidate not found.</p>;

  return (
    <div style={styles.detail}>
      <Link to="/candidates" style={styles.back}>← Back to list</Link>
      <h3>{candidate.name}</h3>
      <p><strong>Role:</strong>  {candidate.role}</p>
      <p><strong>Stage:</strong> {candidate.stage}</p>
      <p><strong>ID:</strong>    {candidate.id}</p>
    </div>
  );
}

// ── Stage badge color ──
const stageColor = { Applied: "#1677ff", Interview: "#fa8c16", Offer: "#52c41a" };

// ── Parent route: /candidates ──
function Candidates() {
  const { candidates, loading, error } = useAppContext();

  return (
    <div style={styles.page}>
      <h2>Candidates</h2>

      <StatusWrapper loading={loading} error={error}>
        <div style={styles.layout}>

          {/* Left: list of candidates */}
          <div style={styles.list}>
            {candidates.map((c) => (
              // Link navigates to /candidates/1, /candidates/2 etc.
              <Link to={`/candidates/${c.id}`} key={c.id} style={styles.row}>
                <span><strong>{c.name}</strong> — {c.role}</span>
                <span style={{ ...styles.badge, background: stageColor[c.stage] || "#ccc" }}>
                  {c.stage}
                </span>
              </Link>
            ))}
          </div>

          {/*
            Right: <Outlet /> renders the matched nested route here.
            When on /candidates        → renders nothing (no nested match)
            When on /candidates/1      → renders <CandidateDetail />
          */}
          <div style={styles.detail}>
            <Outlet />
          </div>

        </div>
      </StatusWrapper>
    </div>
  );
}

const styles = {
  page:   { padding: 24 },
  layout: { display: "flex", gap: 24 },
  list:   { flex: "0 0 320px" },
  row: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "10px 14px", marginBottom: 8, border: "1px solid #eee",
    borderRadius: 8, textDecoration: "none", color: "#333", background: "#fff",
  },
  badge:  { color: "#fff", padding: "2px 10px", borderRadius: 12, fontSize: 12 },
  detail: { flex: 1, background: "#fafafa", borderRadius: 8, padding: 16 },
  back:   { display: "inline-block", marginBottom: 12, color: "#6C3CE1" },
};

export default Candidates;