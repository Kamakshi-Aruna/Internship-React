// =======================================================
//  REST ENDPOINTS — /api/candidates
// =======================================================
//
//  REST = a convention for URLs and HTTP methods:
//
//  GET    /api/candidates        → list all candidates
//  GET    /api/candidates/:id    → get one candidate
//  POST   /api/candidates        → add a new candidate
//  PUT    /api/candidates/:id    → update a candidate
//  DELETE /api/candidates/:id    → delete a candidate
//
//  HTTP method tells the server WHAT to do.
//  URL path tells the server WHERE to do it.
// =======================================================

const express    = require("express");
const candidates = require("../04-data/candidates");

const router = express.Router();

// ── GET /api/candidates ─────────────────────────────────
// Returns all candidates.
// Optional: filter by stage → GET /api/candidates?stage=Interview
router.get("/", (req, res) => {
  const { stage } = req.query; // read ?stage=xxx from URL

  if (stage) {
    const filtered = candidates.filter(
      (c) => c.stage.toLowerCase() === stage.toLowerCase()
    );
    return res.json({ success: true, count: filtered.length, data: filtered });
  }

  res.json({ success: true, count: candidates.length, data: candidates });
});

// ── GET /api/candidates/:id ─────────────────────────────
// Returns ONE candidate by ID.
// :id is a URL parameter — req.params.id reads it.
router.get("/:id", (req, res) => {
  const id        = Number(req.params.id);
  const candidate = candidates.find((c) => c.id === id);

  if (!candidate) {
    // Always send meaningful HTTP status codes:
    // 404 = Not Found
    return res.status(404).json({ success: false, message: `Candidate ${id} not found` });
  }

  res.json({ success: true, data: candidate });
});

// ── POST /api/candidates ────────────────────────────────
// Creates a new candidate.
// Body comes from req.body (needs express.json() middleware).
router.post("/", (req, res) => {
  const { name, role, stage, email, experience } = req.body;

  // Basic validation
  if (!name || !role) {
    return res.status(400).json({ success: false, message: "name and role are required" });
  }

  const newCandidate = {
    id: candidates.length + 1,
    name,
    role,
    stage:      stage      || "Applied",
    email:      email      || "",
    experience: experience || 0,
  };

  candidates.push(newCandidate);

  // 201 = Created (more specific than 200 OK)
  res.status(201).json({ success: true, data: newCandidate });
});

// ── DELETE /api/candidates/:id ──────────────────────────
router.delete("/:id", (req, res) => {
  const id    = Number(req.params.id);
  const index = candidates.findIndex((c) => c.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: `Candidate ${id} not found` });
  }

  candidates.splice(index, 1);
  res.json({ success: true, message: `Candidate ${id} deleted` });
});

module.exports = router;