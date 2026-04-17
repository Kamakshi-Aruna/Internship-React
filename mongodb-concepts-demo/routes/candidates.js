const express = require("express");
const router = express.Router();
const Candidate = require("../models/Candidate");

// ─────────────────────────────────────────────────────────────────────────────
// PAGINATION + SORTING for candidates
// GET /candidates?page=1&limit=3&sortBy=experienceYears&order=desc
// ─────────────────────────────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  const page   = parseInt(req.query.page)  || 1;
  const limit  = parseInt(req.query.limit) || 3;
  const sortBy = req.query.sortBy          || "createdAt";
  const order  = req.query.order === "asc" ? 1 : -1;

  const skip = (page - 1) * limit;

  const [candidates, total] = await Promise.all([
    Candidate.find()
      .populate("appliedJobs", "title company salary") // auto-fill job details
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit),
    Candidate.countDocuments(),
  ]);

  res.json({
    page,
    limit,
    totalCandidates: total,
    totalPages: Math.ceil(total / limit),
    candidates,
  });
});


// ─────────────────────────────────────────────────────────────────────────────
// POPULATE — get one candidate with full job details
// GET /candidates/:id
//
// Without populate response:
//   { name: "Alice", appliedJobs: ["64a1...", "64a2..."] }   ← useless IDs
//
// With populate response:
//   { name: "Alice", appliedJobs: [{ title: "Backend Dev", company: "Google" }, ...] }
// ─────────────────────────────────────────────────────────────────────────────
router.get("/:id", async (req, res) => {
  const candidate = await Candidate.findById(req.params.id)
    .populate("appliedJobs"); // ← replaces ObjectIds with full Job documents

  if (!candidate) return res.status(404).json({ error: "Candidate not found" });
  res.json(candidate);
});


// ─────────────────────────────────────────────────────────────────────────────
// AGGREGATION — group candidates by experience level
// GET /candidates/stats/by-experience
//
// Beginner  = 0-2 years
// Mid-level = 3-5 years
// Senior    = 6+ years
// ─────────────────────────────────────────────────────────────────────────────
router.get("/stats/by-experience", async (req, res) => {
  const stats = await Candidate.aggregate([

    // STAGE 1: $project — add a computed field "level" based on experienceYears
    {
      $project: {
        name: 1,
        experienceYears: 1,
        skills: 1,
        level: {
          $switch: {
            branches: [
              { case: { $lte: ["$experienceYears", 2] }, then: "Beginner" },
              { case: { $lte: ["$experienceYears", 5] }, then: "Mid-level" },
            ],
            default: "Senior"
          }
        }
      }
    },

    // STAGE 2: $group — group by the level we just computed
    {
      $group: {
        _id: "$level",
        count: { $sum: 1 },
        names: { $push: "$name" },
        avgExperience: { $avg: "$experienceYears" },
      }
    },

    // STAGE 3: $project — clean up output
    {
      $project: {
        _id: 0,
        level: "$_id",
        count: 1,
        names: 1,
        avgExperience: { $round: ["$avgExperience", 1] },
      }
    },

    { $sort: { avgExperience: 1 } }
  ]);

  res.json(stats);
});

module.exports = router;