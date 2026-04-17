// -------------------------------------------------------
// DEMO: Reusable Modal Component
// Modal uses:
//   - useState to control open/close
//   - a boolean prop `isOpen` to decide if it renders
//   - an `onClose` callback prop to let the parent close it
//   - `children` to render any content inside the modal
// -------------------------------------------------------
import { useState } from "react";

// --- The Modal itself (pure presentational + behaviour) ---
function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null; // render nothing when closed

  const overlayStyle = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  };

  const boxStyle = {
    background: "#fff",
    borderRadius: 8,
    padding: 24,
    minWidth: 320,
    maxWidth: 480,
    position: "relative",
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      {/* stopPropagation prevents overlay-click from closing when clicking inside */}
      <div style={boxStyle} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginTop: 0 }}>{title}</h3>
        {children}
        <button onClick={onClose} style={{ marginTop: 16 }}>
          Close
        </button>
      </div>
    </div>
  );
}

// --- Demo: parent controls the open/close state ---
function ModalDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const candidates = [
    { id: 1, name: "Alice", role: "Engineer" },
    { id: 2, name: "Bob", role: "Designer" },
  ];

  function openModal(candidate) {
    setSelected(candidate);
    setIsOpen(true);
  }

  return (
    <div>
      <h2>Modal Component Demo</h2>

      {candidates.map((c) => (
        <div key={c.id}>
          <span>{c.name} — {c.role} </span>
          <button onClick={() => openModal(c)}>View Details</button>
        </div>
      ))}

      {/* Modal is always in the tree; isOpen controls visibility */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={selected?.name}
      >
        <p>Role: {selected?.role}</p>
        <p>ID: {selected?.id}</p>
      </Modal>
    </div>
  );
}

export { Modal };
export default ModalDemo;