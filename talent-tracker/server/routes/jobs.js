const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const protect = require('../middleware/authMiddleware');

router.use(protect);

// GET /api/jobs
router.get('/', async (req, res, next) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    next(err);
  }
});

// POST /api/jobs
router.post('/', async (req, res, next) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
});

// PUT /api/jobs/:id
router.put('/:id', async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/jobs/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ message: 'Job deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;