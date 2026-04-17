const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const Job = require('../models/Job');
const protect = require('../middleware/authMiddleware');

router.use(protect);

// GET /api/stats
router.get('/', async (req, res, next) => {
  try {
    const [
      totalCandidates,
      totalJobs,
      candidateStatusAgg,
      jobStatusAgg,
      recentCandidates,
    ] = await Promise.all([
      Candidate.countDocuments(),
      Job.countDocuments(),
      Candidate.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Job.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Candidate.find().sort({ createdAt: -1 }).limit(5).select('name role status createdAt'),
    ]);

    const byStatus = candidateStatusAgg.reduce((acc, cur) => {
      acc[cur._id] = cur.count;
      return acc;
    }, {});

    const jobsByStatus = jobStatusAgg.reduce((acc, cur) => {
      acc[cur._id] = cur.count;
      return acc;
    }, {});

    res.json({
      totalCandidates,
      totalJobs,
      byStatus,
      jobsByStatus,
      recentCandidates,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;