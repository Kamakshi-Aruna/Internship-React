import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// A counter that shows the page is still alive (resets on full reload)
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div style={styles.counter}>
      <p>Counter: <strong>{count}</strong></p>
      <button onClick={() => setCount(count + 1)} style={styles.btn}>+1</button>
      <p style={styles.hint}>Increase this, then click a nav link. See if it resets!</p>
    </div>
  );
}

function Home() {
  return <h2 style={styles.page}>Home Page</h2>;
}

function About() {
  return <h2 style={styles.page}>About Page</h2>;
}

function WithAnchorTag() {
  return (
    <div style={styles.section}>
      <h2 style={{ color: '#e74c3c' }}>Using &lt;a&gt; tag (BAD in React)</h2>
      <p>Click these links — the whole page reloads. Counter resets to 0.</p>
      <nav style={styles.nav}>
        <a href="/" style={styles.link}>Home</a>
        <a href="/about" style={styles.link}>About</a>
      </nav>
      <Counter />
    </div>
  );
}

function WithLinkTag() {
  return (
    <div style={styles.section}>
      <h2 style={{ color: '#27ae60' }}>Using &lt;Link&gt; (CORRECT in React)</h2>
      <p>Click these links — NO page reload. Counter stays the same!</p>
      <nav style={styles.nav}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/about" style={styles.link}>About</Link>
      </nav>
      <Counter />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div style={styles.app}>
        <h1 style={styles.title}>anchor tag vs Link — What is the difference?</h1>

        <div style={styles.grid}>
          <WithAnchorTag />
          <WithLinkTag />
        </div>

        <div style={styles.pageArea}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

const styles = {
  app: { fontFamily: 'sans-serif', padding: '20px', maxWidth: '900px', margin: '0 auto' },
  title: { textAlign: 'center', marginBottom: '30px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  section: { border: '2px solid #ddd', borderRadius: '10px', padding: '20px' },
  nav: { display: 'flex', gap: '15px', margin: '10px 0' },
  link: { padding: '8px 16px', background: '#3498db', color: 'white', borderRadius: '5px', textDecoration: 'none' },
  counter: { marginTop: '20px', padding: '15px', background: '#f8f8f8', borderRadius: '8px', textAlign: 'center' },
  btn: { padding: '8px 20px', fontSize: '16px', cursor: 'pointer' },
  hint: { fontSize: '13px', color: '#666', marginTop: '8px' },
  page: { textAlign: 'center', padding: '20px', background: '#eef', borderRadius: '8px', marginTop: '20px' },
};