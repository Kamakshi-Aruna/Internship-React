// =======================================================
//  FETCH DATA FROM EXPRESS BACKEND
//  React (port 3000) → Express API (port 5000)
// =======================================================

import { useState, useEffect } from "react";

function FetchCandidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/candidates")
      .then((res) => {
        if (!res.ok) throw new Error("Server error: " + res.status);
        return res.json();
      })
      .then((json) => {
        setCandidates(json.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading from Express API...</p>;
  if (error)   return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div>
      <h2>Candidates — fetched from Express (port 5000)</h2>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th style={th}>Name</th>
            <th style={th}>Role</th>
            <th style={th}>Stage</th>
            <th style={th}>Email</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((c) => (
            <tr key={c.id}>
              <td style={td}>{c.name}</td>
              <td style={td}>{c.role}</td>
              <td style={td}>{c.stage}</td>
              <td style={td}>{c.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th = { padding: "10px 14px", textAlign: "left", borderBottom: "2px solid #ddd" };
const td = { padding: "10px 14px", borderBottom: "1px solid #eee" };

export default FetchCandidates;