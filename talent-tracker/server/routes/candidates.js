const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const protect = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// GET /api/candidates
router.get('/', async (req, res, next) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    res.json(candidates);
  } catch (err) {
    next(err);
  }
});

// POST /api/candidates
router.post('/', async (req, res, next) => {
  try {
    const candidate = await Candidate.create(req.body);
    res.status(201).json(candidate);
  } catch (err) {
    next(err);
  }
});

// PUT /api/candidates/:id
router.put('/:id', async (req, res, next) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    res.json(candidate);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/candidates/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    res.json({ message: 'Candidate deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;