// =======================================================
//  REUSABLE: Loading & Error State Wrapper
// =======================================================
//
//  Every page that fetches data needs to handle 3 states:
//    1. loading → show a spinner / skeleton
//    2. error   → show an error message
//    3. success → show the actual content
//
//  Instead of writing if/else in every page, we make one
//  wrapper component and reuse it everywhere.
//
//  Usage:
//  <StatusWrapper loading={loading} error={error}>
//    <YourActualContent />
//  </StatusWrapper>
// =======================================================

function StatusWrapper({ loading, error, children }) {
  if (loading) {
    return (
      <div style={styles.center}>
        <div style={styles.spinner} />
        <p style={{ color: "#888", marginTop: 12 }}>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ ...styles.center, ...styles.errorBox }}>
        <p style={{ fontSize: 24 }}>Something went wrong</p>
        <p style={{ color: "#cc0000" }}>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  // No loading, no error → render the actual content
  return children;
}

const styles = {
  center: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 48,
  },
  spinner: {
    width: 40,
    height: 40,
    border: "4px solid #eee",
    borderTop: "4px solid #6C3CE1",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  errorBox: {
    background: "#fff5f5",
    border: "1px solid #ffc0c0",
    borderRadius: 8,
    margin: 24,
  },
};

// Inject the spin keyframe into the document once
const styleTag = document.createElement("style");
styleTag.innerHTML = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(styleTag);

export default StatusWrapper;