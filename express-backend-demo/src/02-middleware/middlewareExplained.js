// =======================================================
//  WHAT IS MIDDLEWARE?
// =======================================================
//
//  Middleware = a function that runs BETWEEN the request
//  arriving and your route handler running.
//
//  Every middleware receives (req, res, next):
//    req  → the incoming request
//    res  → the outgoing response
//    next → call this to pass to the next middleware/route
//
//  Request flow:
//
//  Client → [helmet] → [cors] → [bodyParser] → [your route]
//                                                    ↓
//  Client  ←─────────────────────────────────  res.json()
//
//  app.use(fn)  → runs for EVERY request
//  app.get(fn)  → runs only for GET requests to that path
// =======================================================

const express = require("express");
const cors    = require("cors");
const helmet  = require("helmet");

const router = express.Router();

// ── 1. helmet ──────────────────────────────────────────
// Sets secure HTTP headers automatically.
// Protects against common attacks (clickjacking, XSS etc.)
// Usage: app.use(helmet())   ← in server.js
// You don't write any logic — helmet does it silently.

// ── 2. cors ────────────────────────────────────────────
// CORS = Cross-Origin Resource Sharing
// By default browsers BLOCK requests from a different origin.
// e.g. React app on localhost:3000 calling API on :5000 → BLOCKED
// cors() middleware adds the right headers to allow it.
// Usage: app.use(cors())

// ── 3. express.json() ──────────────────────────────────
// Parses the JSON body of incoming POST/PUT requests.
// Without it: req.body is undefined.
// With it:    req.body = { name: "Alice", role: "Dev" }
// Usage: app.use(express.json())

// ── Custom middleware example ───────────────────────────
// Logs every request — useful for debugging
function requestLogger(req, res, next) {
  const time = new Date().toISOString();
  console.log(`[${time}] ${req.method} ${req.url}`);
  next(); // MUST call next() or the request hangs forever
}

module.exports = { requestLogger };