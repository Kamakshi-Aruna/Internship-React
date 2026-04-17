const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const Candidate = require("../models/Candidate");

// ─────────────────────────────────────────────────────────────────────────────
// 1. PAGINATION + SORTING
//    GET /jobs?page=1&limit=3&sortBy=salary&order=desc
//
//    Concept: Instead of returning ALL jobs at once (bad for performance),
//    we return a small "page" of results at a time.
//
//    page=1, limit=3 → documents 0-2
//    page=2, limit=3 → documents 3-5
//    Formula: skip = (page - 1) * limit
// ─────────────────────────────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  const page    = parseInt(req.query.page)   || 1;    // default page 1
  const limit   = parseInt(req.query.limit)  || 3;    // default 3 per page
  const sortBy  = req.query.sortBy           || "createdAt";
  const order   = req.query.order === "asc"  ? 1 : -1; // 1=asc, -1=desc

  const skip = (page - 1) * limit;   // ← KEY formula for pagination

  const [jobs, total] = await Promise.all([
    Job.find()
      .sort({ [sortBy]: order })   // dynamic sort field
      .skip(skip)                  // skip previous pages
      .limit(limit),               // take only this page's items
    Job.countDocuments(),          // total count for frontend to build page buttons
  ]);

  res.json({
    page,
    limit,
    totalJobs: total,
    totalPages: Math.ceil(total / limit),
    jobs,
  });
});


// ─────────────────────────────────────────────────────────────────────────────
// 2. AGGREGATION PIPELINE — $match + $group + $project
//    GET /jobs/stats
//
//    Concept: Aggregation is like a pipeline of steps that transforms data.
//    Think of it as a factory conveyor belt — each stage processes the data
//    and passes it to the next stage.
//
//    Stage 1 ($match):   Filter — like WHERE in SQL
//    Stage 2 ($group):   Group by company — like GROUP BY in SQL
//    Stage 3 ($project): Shape the output — pick/rename fields
// ─────────────────────────────────────────────────────────────────────────────
router.get("/stats", async (req, res) => {
  const stats = await Job.aggregate([

    // STAGE 1: $match — only keep jobs with salary > 100000
    // (removes documents that don't match, like a filter)
    {
      $match: { salary: { $gt: 100000 } }
    },

    // STAGE 2: $group — group by company, calculate stats per group
    {
      $group: {
        _id: "$company",                          // group by this field
        totalJobs:   { $sum: 1 },                 // count jobs per company
        avgSalary:   { $avg: "$salary" },         // average salary
        maxSalary:   { $max: "$salary" },         // highest salary
        allTitles:   { $push: "$title" },         // collect all job titles
      }
    },

    // STAGE 3: $project — shape the final output
    // 1 = include,  0 = exclude,  you can also rename fields
    {
      $project: {
        _id: 0,                                   // hide the _id field
        company:    "$_id",                       // rename _id → company
        totalJobs:  1,
        avgSalary:  { $round: ["$avgSalary", 0] }, // round to whole number
        maxSalary:  1,
        allTitles:  1,
      }
    },

    // STAGE 4: $sort — sort by avgSalary descending
    { $sort: { avgSalary: -1 } }

  ]);

  res.json(stats);
});


// ─────────────────────────────────────────────────────────────────────────────
// 3. POPULATE — replace ObjectId references with actual documents
//    GET /jobs/:id/candidates
//
//    Concept: Candidates store Job _ids in their appliedJobs array.
//    Without populate: you get raw ObjectIds → useless to frontend
//    With populate:    Mongoose fetches the actual Job documents for you
// ─────────────────────────────────────────────────────────────────────────────
router.get("/:id/candidates", async (req, res) => {
  // Find all candidates who applied to this job
  const candidates = await Candidate.find({ appliedJobs: req.params.id })
    .populate("appliedJobs", "title company salary"); // ← populate: replace ObjectIds with Job docs
                                                       //   2nd arg = which fields to include

  res.json(candidates);
});


// ─────────────────────────────────────────────────────────────────────────────
// 4. AGGREGATION — $lookup (like SQL JOIN)
//    GET /jobs/with-candidates
//
//    Concept: $lookup joins two collections.
//    Here we join Jobs with Candidates to see who applied to each job.
//
//    SQL equivalent:
//    SELECT j.*, c.name, c.email
//    FROM jobs j
//    LEFT JOIN candidates c ON j._id = ANY(c.appliedJobs)
// ─────────────────────────────────────────────────────────────────────────────
router.get("/with-candidates", async (req, res) => {
  const result = await Job.aggregate([

    // STAGE 1: $lookup — join candidates into each job document
    {
      $lookup: {
        from: "candidates",          // the OTHER collection to join
        localField: "_id",           // field in Jobs
        foreignField: "appliedJobs", // field in Candidates that holds Job _ids
        as: "applicants",            // name of the new array field to add
      }
    },

    // STAGE 2: $project — only keep the fields we want
    {
      $project: {
        title: 1,
        company: 1,
        salary: 1,
        applicantCount: { $size: "$applicants" },    // count applicants
        applicants: {
          $map: {                                     // transform each applicant
            input: "$applicants",
            as: "c",
            in: { name: "$$c.name", email: "$$c.email" }  // only name + email
          }
        }
      }
    },

    // STAGE 3: sort by most applicants first
    { $sort: { applicantCount: -1 } }

  ]);

  res.json(result);
});

module.exports = router;