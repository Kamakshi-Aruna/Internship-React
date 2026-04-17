// -------------------------------------------------------
// DEMO: Reusable Card Component
// A reusable component accepts props to render different
// content but keeps the same structure every time.
// `children` is a special prop — it is whatever you put
// between the opening and closing tags of the component.
// -------------------------------------------------------

function Card({ title, subtitle, children, onClick }) {
  const cardStyle = {
    border: "1px solid #ccc",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    cursor: onClick ? "pointer" : "default",
    maxWidth: 360,
  };

  return (
    <div style={cardStyle} onClick={onClick}>
      {title && <h3 style={{ margin: "0 0 4px" }}>{title}</h3>}
      {subtitle && <p style={{ margin: "0 0 8px", color: "#666" }}>{subtitle}</p>}
      {/* children renders anything passed between <Card>...</Card> */}
      {children}
    </div>
  );
}

// Usage demo — shows Card used in different ways
function CardDemo() {
  return (
    <div>
      <h2>Card Component Demo</h2>

      {/* Plain text as children */}
      <Card title="Candidate: Alice" subtitle="Software Engineer">
        <p>Status: Interview Scheduled</p>
      </Card>

      {/* Different children, same Card shell */}
      <Card title="Job: Frontend Dev" subtitle="Recruitly Inc.">
        <p>Applicants: 24</p>
        <p>Deadline: 2026-05-01</p>
      </Card>

      {/* Card with a click handler */}
      <Card title="Clickable Card" onClick={() => alert("Card clicked!")}>
        <p>Click anywhere on this card</p>
      </Card>
    </div>
  );
}

export { Card };          // named export so Modal can import it
export default CardDemo;  // default export for the demo page