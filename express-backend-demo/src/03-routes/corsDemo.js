// =======================================================
//  CORS DEMO ROUTES
//  Two endpoints with different CORS configs:
//   /api/cors-demo/allowed  → origin: localhost:3000 (works)
//   /api/cors-demo/blocked  → origin: localhost:9999 (blocked)
// =======================================================

const express = require("express");
const cors    = require("cors");

const router = express.Router();

// ── ALLOWED — origin matches React app ──
router.get(
  "/allowed",
  cors({ origin: "http://localhost:3000" }),   // correct origin
  (req, res) => {
    res.json({
      status:  "allowed",
      message: "CORS passed! Server accepted your request.",
      origin:  "http://localhost:3000",
    });
  }
);

// ── BLOCKED — origin does NOT match React app ──
router.get(
  "/allowed",
  cors({ origin: "http://localhost:3000" }),   // wrong origin — will block
  (req, res) => {
    res.json({
      status:  "allowed",
      message: "You should never see this — browser blocked it.",
    });
  }
);

module.exports = router;