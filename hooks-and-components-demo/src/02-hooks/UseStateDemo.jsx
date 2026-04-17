// -------------------------------------------------------
// DEMO: useState
// useState lets a component "remember" a value.
// When the value changes, React re-renders the component.
// -------------------------------------------------------
import { useState } from "react";

function UseStateDemo() {
  // [currentValue, setterFunction] = useState(initialValue)
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");

  return (
    <div>
      <h2>useState Demo</h2>

      {/* --- Counter example --- */}
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
      <button onClick={() => setCount(0)}>Reset</button>

      <hr />

      {/* --- Controlled input example --- */}
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Type your name"
      />
      <p>Hello, {name || "stranger"}!</p>
    </div>
  );
}

export default UseStateDemo;