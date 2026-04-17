// -------------------------------------------------------
// DEMO: Recruitly Codebase Overview Pattern
// In Recruitly the UI is split into:
//   - A list component  (fetches + renders rows)
//   - A detail/card component (renders one item)
//   - A modal for actions (add/edit/view)
//
// This demo mirrors that pattern with fake data so
// interns can see how the pieces connect before touching
// the real codebase.
// -------------------------------------------------------
import { useState, useEffect } from "react";
import { Card } from "../03-reusable-components/Card";
import { Modal } from "../03-reusable-components/Modal";

// --- Simulates an API call (replace with real fetch in Recruitly) ---
function fetchCandidates() {
  return Promise.resolve([
    { id: 1, name: "Alice Johnson", stage: "Applied",   role: "Frontend Dev" },
    { id: 2, name: "Bob Smith",     stage: "Interview", role: "Backend Dev"  },
    { id: 3, name: "Carol White",   stage: "Offer",     role: "DevOps"       },
  ]);
}

// --- Single candidate row rendered as a Card ---
function CandidateCard({ candidate, onSelect }) {
  return (
    <Card
      title={candidate.name}
      subtitle={candidate.role}
      onClick={() => onSelect(candidate)}
    >
      <p>Stage: <strong>{candidate.stage}</strong></p>
    </Card>
  );
}

// --- Main list: fetch → store in state → render cards ---
function CandidateList() {
  const [candidates, setCandidates] = useState([]);
  const [selected, setSelected] = useState(null);

  // Fetch on mount
  useEffect(() => {
    fetchCandidates().then(setCandidates);
  }, []);

  return (
    <div>
      <h2>Recruitly Pattern: Candidate List</h2>
      <p style={{ color: "#888" }}>Click a card to open the detail modal</p>

      {/* Render one CandidateCard per item */}
      {candidates.map((c) => (
        <CandidateCard key={c.id} candidate={c} onSelect={setSelected} />
      ))}

      {/* Detail modal — same pattern used across Recruitly */}
      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title={`Candidate: ${selected?.name}`}
      >
        <p>Role: {selected?.role}</p>
        <p>Pipeline Stage: {selected?.stage}</p>
        <p>ID: {selected?.id}</p>
      </Modal>
    </div>
  );
}

export default CandidateList;