// =======================================================
//  PAGE: Dashboard
// =======================================================
//
//  Reads global state from Context — no prop drilling.
//  Uses StatusWrapper to handle loading/error cleanly.
//  Shows summary counts from candidates + jobs lists.
// =======================================================

import { useAppContext } from "../context/AppContext";
import StatusWrapper from "../components/StatusWrapper";

// A simple stat card
function StatCard({ label, value, color }) {
  return (
    <div style={{ ...styles.card, borderTop: `4px solid ${color}` }}>
      <p style={styles.value}>{value}</p>
      <p style={styles.label}>{label}</p>
    </div>
  );
}

function Dashboard() {
  const { candidates, jobs, loading, error } = useAppContext();

  // Count how many candidates are in each stage
  const inInterview = candidates.filter((c) => c.stage === "Interview").length;
  const withOffer   = candidates.filter((c) => c.stage === "Offer").length;
  const openJobs    = jobs.filter((j) => j.status === "Open").length;

  return (
    <div style={styles.page}>
      <h2>Dashboard</h2>

      {/* StatusWrapper handles loading spinner & error message */}
      <StatusWrapper loading={loading} error={error}>
        <div style={styles.grid}>
          <StatCard label="Total Candidates" value={candidates.length} color="#6C3CE1" />
          <StatCard label="In Interview"     value={inInterview}       color="#fa8c16" />
          <StatCard label="Offers Made"      value={withOffer}         color="#52c41a" />
          <StatCard label="Open Jobs"        value={openJobs}          color="#1677ff" />
        </div>
      </StatusWrapper>
    </div>
  );
}

const styles = {
  page:  { padding: 24 },
  grid:  { display: "flex", gap: 16, flexWrap: "wrap" },
  card:  { background: "#fff", border: "1px solid #eee", borderRadius: 8, padding: "20px 28px", minWidth: 160 },
  value: { fontSize: 32, fontWeight: 700, margin: 0 },
  label: { color: "#888", margin: "4px 0 0" },
};

export default Dashboard;