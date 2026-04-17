import { useState } from "react";

import FunctionalComponentDemo from "./01-functional-components/FunctionalComponent";
import UseStateDemo            from "./02-hooks/UseStateDemo";
import UseEffectDemo           from "./02-hooks/UseEffectDemo";
import UseContextDemo          from "./02-hooks/UseContextDemo";
import CardDemo                from "./03-reusable-components/Card";
import ModalDemo               from "./03-reusable-components/Modal";
import CandidateList           from "./04-recruitly-overview/CandidateList";
import FetchCandidates         from "./05-fetch-from-api/FetchCandidates";
import CorsDemo                from "./05-fetch-from-api/CorsDemo";

const DEMOS = [
  { label: "01 – Functional Components", component: FunctionalComponentDemo },
  { label: "02 – useState",              component: UseStateDemo            },
  { label: "02 – useEffect",             component: UseEffectDemo           },
  { label: "02 – useContext",            component: UseContextDemo          },
  { label: "03 – Card Component",        component: CardDemo                },
  { label: "03 – Modal Component",       component: ModalDemo               },
  { label: "04 – Recruitly Pattern",     component: CandidateList           },
  { label: "05 – Fetch from API",        component: FetchCandidates         },
  { label: "05 – CORS Demo",             component: CorsDemo                },
];

function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const ActiveDemo = DEMOS[activeIndex].component;

  return (
    <div style={{ display: "flex", fontFamily: "sans-serif" }}>
      {/* Sidebar navigation */}
      <nav style={{ width: 240, borderRight: "1px solid #ddd", padding: 16, minHeight: "100vh" }}>
        <h3 style={{ marginTop: 0 }}>React Intern Demos</h3>
        {DEMOS.map((demo, i) => (
          <div
            key={i}
            onClick={() => setActiveIndex(i)}
            style={{
              padding: "8px 12px",
              marginBottom: 4,
              borderRadius: 6,
              cursor: "pointer",
              background: i === activeIndex ? "#0070f3" : "transparent",
              color: i === activeIndex ? "#fff" : "#333",
            }}
          >
            {demo.label}
          </div>
        ))}
      </nav>

      {/* Demo area */}
      <main style={{ padding: 24, flex: 1 }}>
        <ActiveDemo />
      </main>
    </div>
  );
}

export default App;