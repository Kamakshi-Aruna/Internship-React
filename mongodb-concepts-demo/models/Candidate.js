const mongoose = require("mongoose");

// CANDIDATE MODEL
// Each candidate has a name, skills, experience, and references which jobs they applied to
const candidateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },          // e.g. "Alice"
    email: { type: String, required: true },         // e.g. "alice@email.com"
    skills: [String],                                // e.g. ["React", "Node.js"]
    experienceYears: { type: Number, default: 0 },   // e.g. 3

    // REFERENCE — stores the Job's _id (like a foreign key in SQL)
    // This is how MongoDB links two collections together
    appliedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",   // <-- tells Mongoose: "this ID points to the Job collection"
      },
    ],
  },
  { timestamps: true }
);

// INDEX on name for fast lookup
candidateSchema.index({ name: 1 });

// COMPOUND INDEX — speeds up queries that filter by both skills AND experience
candidateSchema.index({ skills: 1, experienceYears: -1 });

module.exports = mongoose.model("Candidate", candidateSchema);