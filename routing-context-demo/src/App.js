// =======================================================
//  ROUTING SETUP — React Router v6
// =======================================================
//
//  BrowserRouter  → enables URL-based routing for the app
//  Routes         → container for all route definitions
//  Route          → maps a URL path to a component
//
//  Nested routes:
//  <Route path="/candidates">            ← parent route
//    <Route index element={...} />       ← renders at /candidates
//    <Route path=":id" element={...} />  ← renders at /candidates/123
//  </Route>
//
//  The parent component must have <Outlet /> to render children.
//
//  AppProvider wraps everything so all pages share global state.
// =======================================================

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Candidates, { CandidateDetail } from "./pages/Candidates";
import Jobs from "./pages/Jobs";

function App() {
  return (
    // 1. AppProvider — global state available to all pages
    <AppProvider>
      {/* 2. BrowserRouter — enables routing based on URL */}
      <BrowserRouter>
        <Navbar />

        {/* 3. Routes — only the first matching route renders */}
        <Routes>
          <Route path="/"            element={<Dashboard />} />
          <Route path="/jobs"        element={<Jobs />} />

          {/* Nested route: /candidates and /candidates/:id */}
          <Route path="/candidates"  element={<Candidates />}>
            <Route path=":id"        element={<CandidateDetail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;