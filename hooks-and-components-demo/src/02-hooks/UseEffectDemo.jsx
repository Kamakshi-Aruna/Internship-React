// -------------------------------------------------------
// DEMO: useEffect
// useEffect runs side-effects AFTER the component renders.
// The dependency array controls WHEN it re-runs:
//   []         → runs once on mount (like componentDidMount)
//   [value]    → runs when `value` changes
//   no array   → runs after every render (rare)
// -------------------------------------------------------
import { useState, useEffect } from "react";

function UseEffectDemo() {
  const [userId, setUserId] = useState(1);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Runs whenever `userId` changes — fetches user from a public API
  useEffect(() => {
    setLoading(true);
    setUser(null);

    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      });

    // Cleanup function: cancels stale work if userId changes fast
    return () => {
      setLoading(false);
    };
  }, [userId]); // <-- dependency array

  return (
    <div>
      <h2>useEffect Demo — fetch on state change</h2>

      <label>User ID: </label>
      <select value={userId} onChange={(e) => setUserId(Number(e.target.value))}>
        {[1, 2, 3, 4, 5].map((id) => (
          <option key={id} value={id}>
            {id}
          </option>
        ))}
      </select>

      {loading && <p>Loading...</p>}

      {user && (
        <pre style={{ background: "#f4f4f4", padding: 12 }}>
          {JSON.stringify({ id: user.id, name: user.name, email: user.email }, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default UseEffectDemo;