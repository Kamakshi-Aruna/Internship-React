const mongoose = require("mongoose");

// JOB MODEL
// Each job has a title, company, skills required, and salary
const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },       // e.g. "Backend Developer"
    company: { type: String, required: true },      // e.g. "Google"
    skills: [String],                               // e.g. ["Node.js", "MongoDB"]
    salary: { type: Number, required: true },       // e.g. 80000
    location: { type: String },                     // e.g. "Remote"
  },
  { timestamps: true }
);

// INDEX — speeds up searches by title and company
// Without index: MongoDB scans every document (slow for large data)
// With index:    MongoDB jumps directly to matching docs (fast)
jobSchema.index({ title: 1 });        // single field index on title
jobSchema.index({ company: 1 });      // single field index on company
jobSchema.index({ salary: -1 });      // descending index (great for "sort by salary")

module.exports = mongoose.model("Job", jobSchema);