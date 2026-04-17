// =======================================================
//  NODE.JS FUNDAMENTAL 1: Modules
// =======================================================
//
//  Node uses CommonJS modules (the original Node standard):
//    module.exports = ...   → export something
//    require('./file')      → import something
//
//  (React uses ES Modules: export/import — different syntax)
//
//  Rule: every .js file in Node is its own module.
//  Nothing leaks out unless you explicitly export it.
// =======================================================

// --- Define some utilities in this module ---

function formatCandidate(candidate) {
  return `${candidate.name} (${candidate.role}) — Stage: ${candidate.stage}`;
}

function getStageColor(stage) {
  const colors = {
    Applied:   "blue",
    Interview: "orange",
    Offer:     "green",
    Rejected:  "red",
  };
  return colors[stage] || "grey";
}

// Export as an object — only these two are accessible outside
module.exports = { formatCandidate, getStageColor };

// -------------------------------------------------------
// To use this module in another file:
//   const { formatCandidate } = require('./modules');
// -------------------------------------------------------