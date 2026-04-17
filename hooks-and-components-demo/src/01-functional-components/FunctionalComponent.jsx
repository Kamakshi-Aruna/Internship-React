// -------------------------------------------------------
// DEMO: Functional Component
// A functional component is just a JS function that
// returns JSX. It can receive data via "props".
// -------------------------------------------------------

// Props are read-only values passed from a parent
function Greeting({ name, role }) {
  return (
    <div>
      <p>Name: {name}</p>
      <p>Role: {role}</p>
    </div>
  );
}

// Parent component passing props down to Greeting
function FunctionalComponentDemo() {
  return (
    <div>
      <h2>Functional Component Demo</h2>

      {/* Each Greeting gets its own props */}
      <Greeting name="Alice" role="Engineer" />
      <Greeting name="Bob" role="Designer" />
    </div>
  );
}

export default FunctionalComponentDemo;