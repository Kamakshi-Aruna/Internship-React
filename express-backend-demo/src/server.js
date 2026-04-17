// =======================================================
//  EXPRESS SERVER — entry point
// =======================================================
//
//  Order of app.use() matters:
//  1. Security (helmet)
//  2. CORS — must be before routes
//  3. Body parser — must be before routes that read req.body
//  4. Logger (custom)
//  5. Routes
//  6. 404 handler (catch-all — must be LAST)
// =======================================================

const express         = require("express");
const cors            = require("cors");
const helmet          = require("helmet");
const candidateRoutes = require("./03-routes/candidateRoutes");
const corsDemoRoutes  = require("./03-routes/corsDemo");
const { requestLogger } = require("./02-middleware/middlewareExplained");

const app  = express();
const PORT = 5000;

// ── 1. helmet — sets secure HTTP headers ──
app.use(helmet());

// ── 2. cors — allows React app (port 3000) to call this API ──
app.use(cors({
  origin: "http://localhost:3000",  // only allow requests from React dev server
  methods: [ "POST", "PUT", "DELETE"],
}));

// ── 3. body parser — lets us read req.body as JSON ──
app.use(express.json());

// ── 4. custom logger — logs every incoming request ──
app.use(requestLogger);

// ── 5. routes ──
// All candidate routes are prefixed with /api/candidates
app.use("/api/candidates", candidateRoutes);
app.use("/api/cors-demo",  corsDemoRoutes);

// Health check — quick way to verify server is running
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── 6. 404 handler — catches any unmatched route ──
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.url} not found` });
});

// ── Start the server ──
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  GET    http://localhost:${PORT}/health`);
  console.log(`  GET    http://localhost:${PORT}/api/candidates`);
  console.log(`  GET    http://localhost:${PORT}/api/candidates?stage=Interview`);
  console.log(`  GET    http://localhost:${PORT}/api/candidates/1`);
  console.log(`  POST   http://localhost:${PORT}/api/candidates`);
  console.log(`  DELETE http://localhost:${PORT}/api/candidates/1`);
});