/**
 * Search UI Demo — Express Server
 * ────────────────────────────────
 * GET  /api/candidates   — search + facet counts via MongoDB $facet aggregation
 * POST /api/candidates   — create a new candidate
 *
 * MongoDB: mongodb://localhost:27017/talent-tracker  (same DB as talent-tracker)
 * Port:    3001
 */

const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');
const Candidate = require('./models/Candidate');

const app  = express();
const PORT = 3001;
const MONGO_URI = 'mongodb://localhost:27017/talent-tracker';

app.use(cors());
app.use(express.json());

// ── DB connect ────────────────────────────────────────────────────────────────
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB connected: talent-tracker'))
  .catch((err) => { console.error(err.message); process.exit(1); });

// ── GET /api/candidates ───────────────────────────────────────────────────────
// Query params:
//   q         — free-text (searches name, bio, skills, location, role)
//   skills    — comma-separated  e.g. React,Node.js
//   locations — comma-separated  e.g. Austin,Seattle
//   statuses  — comma-separated  e.g. Applied,Hired
//   sort      — relevance | exp_desc | exp_asc | name_asc
//
// Returns: { results: [...], facets: { skills, locations, statuses }, total }
// ─────────────────────────────────────────────────────────────────────────────
app.get('/api/candidates', async (req, res) => {
  try {
    const {
      q         = '',
      skills    = '',
      locations = '',
      statuses  = '',
      sort      = 'relevance',
    } = req.query;

    // Parse comma-separated filter values
    const skillsArr    = skills    ? skills.split(',').filter(Boolean)    : [];
    const locationsArr = locations ? locations.split(',').filter(Boolean) : [];
    const statusesArr  = statuses  ? statuses.split(',').filter(Boolean)  : [];

    // ── Stage 1: text search (facet counts are computed from this set) ────────
    const textMatch = q.trim()
      ? {
          $or: [
            { name:     { $regex: q, $options: 'i' } },
            { bio:      { $regex: q, $options: 'i' } },
            { skills:   { $regex: q, $options: 'i' } },
            { location: { $regex: q, $options: 'i' } },
            { role:     { $regex: q, $options: 'i' } },
          ],
        }
      : {};

    // ── Facet filters (applied to results only, not to facet counts) ──────────
    const facetMatch = {};
    if (skillsArr.length)    facetMatch.skills    = { $in: skillsArr };
    if (locationsArr.length) facetMatch.location  = { $in: locationsArr };
    if (statusesArr.length)  facetMatch.status    = { $in: statusesArr };

    // ── Sort ──────────────────────────────────────────────────────────────────
    const sortMap = {
      exp_desc:  { experience_years: -1 },
      exp_asc:   { experience_years:  1 },
      name_asc:  { name: 1 },
      relevance: { createdAt: -1 },
    };
    const sortSpec = sortMap[sort] ?? sortMap.relevance;

    // ── MongoDB $facet pipeline ───────────────────────────────────────────────
    // All sub-pipelines receive the same text-filtered documents.
    // Only "results" applies the extra facet filters — this is the standard
    // e-commerce pattern: sidebar counts stay stable while results narrow.
    const [data] = await Candidate.aggregate([
      { $match: textMatch },
      {
        $facet: {
          results: [
            ...(Object.keys(facetMatch).length ? [{ $match: facetMatch }] : []),
            { $sort: sortSpec },
            { $project: { __v: 0 } },
          ],
          skills_facet: [
            { $unwind: { path: '$skills', preserveNullAndEmptyArrays: false } },
            { $group: { _id: '$skills', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ],
          location_facet: [
            { $match: { location: { $exists: true, $ne: null, $ne: '' } } },
            { $group: { _id: '$location', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ],
          status_facet: [
            { $group: { _id: '$status', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ],
        },
      },
    ]);

    res.json({
      results: data.results,
      total:   data.results.length,
      facets: {
        skills:    data.skills_facet.map((d)    => ({ value: d._id, count: d.count })),
        locations: data.location_facet.map((d)  => ({ value: d._id, count: d.count })),
        statuses:  data.status_facet.map((d)    => ({ value: d._id, count: d.count })),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/candidates ──────────────────────────────────────────────────────
// Body: { name, email, role, status, location, experience_years, skills, bio }
// ─────────────────────────────────────────────────────────────────────────────
app.post('/api/candidates', async (req, res) => {
  try {
    const candidate = await Candidate.create(req.body);
    res.status(201).json(candidate);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Search API running at http://localhost:${PORT}`));