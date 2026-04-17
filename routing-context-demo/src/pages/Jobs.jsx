// =======================================================
//  PAGE: Jobs
// =======================================================
//
//  Reads jobs from global Context.
//  Shows loading/error via StatusWrapper.
//  Demonstrates that multiple pages share the SAME data
//  fetched once in AppProvider — no duplicate API calls.
// =======================================================

import { useAppContext } from "../context/AppContext";
import StatusWrapper from "../components/StatusWrapper";

function Jobs() {
  const { jobs, loading, error } = useAppContext();

  return (
    <div style={styles.page}>
      <h2>Jobs</h2>
      <p style={{ color: "#888" }}>
        Data loaded once in AppProvider — not fetched again here.
      </p>

      <StatusWrapper loading={loading} error={error}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Job Title</th>
              <th style={styles.th}>Applicants</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td style={styles.td}>{job.title}</td>
                <td style={styles.td}>{job.applicants}</td>
                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.badge,
                      background: job.status === "Open" ? "#52c41a" : "#aaa",
                    }}
                  >
                    {job.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </StatusWrapper>
    </div>
  );
}

const styles = {
  page:  { padding: 24 },
  table: { width: "100%", borderCollapse: "collapse", maxWidth: 560 },
  th:    { textAlign: "left", padding: "10px 14px", borderBottom: "2px solid #eee", background: "#fafafa" },
  td:    { padding: "10px 14px", borderBottom: "1px solid #f0f0f0" },
  badge: { color: "#fff", padding: "2px 10px", borderRadius: 12, fontSize: 12 },
};

export default Jobs;