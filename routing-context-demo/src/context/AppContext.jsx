// =======================================================
//  GLOBAL STATE — Context API
// =======================================================
//
//  Problem: Dashboard, Candidates, Jobs pages all need the
//  same data (candidates list, jobs list). Instead of
//  fetching in every page separately, we fetch ONCE here
//  and share it globally.
//
//  Pattern:
//  1. createContext()         → makes the context
//  2. AppProvider             → fetches data, holds state,
//                               wraps the whole app
//  3. useAppContext()         → any page reads the data
//
//  Loading & Error states live here too — one place to
//  manage async state that all pages can read.
// =======================================================

import { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext(null);

// ── Fake API helpers (replace with real fetch in Recruitly) ──
function fakeFetchCandidates() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Uncomment to test error state:
      // reject(new Error("Failed to load candidates"));
      resolve([
        { id: 1, name: "Alice Johnson", role: "Frontend Dev",  stage: "Interview" },
        { id: 2, name: "Bob Smith",     role: "Backend Dev",   stage: "Applied"   },
        { id: 3, name: "Carol White",   role: "DevOps",        stage: "Offer"     },
      ]);
    }, 1200); // simulate network delay
  });
}

function fakeFetchJobs() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, title: "Frontend Developer",  applicants: 12, status: "Open"   },
        { id: 2, title: "Backend Engineer",     applicants: 8,  status: "Open"   },
        { id: 3, title: "DevOps Engineer",      applicants: 5,  status: "Closed" },
      ]);
    }, 1000);
  });
}

// ── Provider: wraps the app, owns all shared state ──
export function AppProvider({ children }) {
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs]             = useState([]);
  const [loading, setLoading]       = useState(true);   // true while fetching
  const [error, setError]           = useState(null);   // null = no error

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Fetch both in parallel with Promise.all
    Promise.all([fakeFetchCandidates(), fakeFetchJobs()])
      .then(([candidateData, jobData]) => {
        setCandidates(candidateData);
        setJobs(jobData);
      })
      .catch((err) => {
        setError(err.message);  // store the error message
      })
      .finally(() => {
        setLoading(false);       // always stop loading
      });
  }, []); // fetch once on app mount

  // Everything in `value` is accessible to any child component
  const value = { candidates, jobs, loading, error };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ── Custom hook — cleaner to use than useContext(AppContext) everywhere ──
export function useAppContext() {
  return useContext(AppContext);
}