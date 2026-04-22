/**
 * ES Aggregations Demo — Beginner Friendly
 * =========================================
 * Covers:
 *  1. Terms Aggregation  — faceted counts (skills, location, status)
 *  2. Date Histogram     — trend charts (applications over time)
 *  3. Nested / Multi-level Aggregations — drill-down (skills per location, avg experience per status)
 *
 * Prereqs:
 *  - Elasticsearch running at http://localhost:9200
 *  - "candidates" index already populated (run elasticsearch-concepts-demo first)
 *
 * Start: node server.js
 * Base URL: http://localhost:3003
 */

const express = require('express');
const cors = require('cors');
const { Client } = require('@elastic/elasticsearch');

const app = express();
app.use(cors());
app.use(express.json());

// ─── Elasticsearch Client ────────────────────────────────────────────────────
const es = new Client({ node: 'http://localhost:9200' });
const INDEX = 'candidates';

// ─── Helper: format aggregation bucket arrays ────────────────────────────────
function formatBuckets(buckets) {
  return buckets.map((b) => ({ key: b.key_as_string ?? b.key, count: b.doc_count }));
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. TERMS AGGREGATION — Faceted Counts
//    Like SQL: SELECT location, COUNT(*) FROM candidates GROUP BY location
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /api/agg/skills
 * Top skills across all candidates.
 *
 * ES concept: "terms" agg on a keyword field counts unique values + how many
 * documents contain each. Perfect for tag clouds or filter sidebars.
 */
app.get('/api/agg/skills', async (req, res) => {
  try {
    const result = await es.search({
      index: INDEX,
      size: 0,           // We only want aggregation results, not raw docs
      aggs: {
        top_skills: {
          terms: {
            field: 'skills.keyword',  // .keyword = exact match sub-field
            size: 10,                 // Return top 10 skills
          },
        },
      },
    });

    res.json({
      explanation: 'Terms aggregation: counts how many candidates have each skill',
      total_candidates: result.hits.total.value,
      skills: formatBuckets(result.aggregations.top_skills.buckets),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/agg/locations
 * Candidate count per location.
 */
app.get('/api/agg/locations', async (req, res) => {
  try {
    const result = await es.search({
      index: INDEX,
      size: 0,
      aggs: {
        by_location: {
          terms: {
            field: 'location',
            size: 20,
          },
        },
      },
    });

    res.json({
      explanation: 'Terms aggregation: counts candidates per city/location',
      locations: formatBuckets(result.aggregations.by_location.buckets),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/agg/status
 * Candidate count per status (active, inactive, hired, etc.)
 */
app.get('/api/agg/status', async (req, res) => {
  try {
    const result = await es.search({
      index: INDEX,
      size: 0,
      aggs: {
        by_status: {
          terms: {
            field: 'status',
          },
        },
      },
    });

    res.json({
      explanation: 'Terms aggregation: counts candidates per status value',
      statuses: formatBuckets(result.aggregations.by_status.buckets),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// 2. DATE HISTOGRAM AGGREGATION — Trend Charts
//    Groups documents into time buckets (day / week / month / year)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /api/agg/applications-over-time?interval=month
 * How many candidates applied each month.
 *
 * ES concept: "date_histogram" splits documents into fixed time intervals.
 * Great for line charts showing hiring pipeline activity over time.
 *
 * Query param: interval = day | week | month | quarter | year  (default: month)
 */
app.get('/api/agg/applications-over-time', async (req, res) => {
  const interval = req.query.interval || 'month';
  const validIntervals = ['day', 'week', 'month', 'quarter', 'year'];

  if (!validIntervals.includes(interval)) {
    return res.status(400).json({ error: `interval must be one of: ${validIntervals.join(', ')}` });
  }

  try {
    const result = await es.search({
      index: INDEX,
      size: 0,
      aggs: {
        applications_trend: {
          date_histogram: {
            field: 'applied_at',          // Must be a date field in the mapping
            calendar_interval: interval,  // ES 8.x uses calendar_interval
            format: 'yyyy-MM-dd',         // Human-readable bucket keys
            min_doc_count: 0,             // Include empty buckets (shows gaps in data)
            // Limit range to last 2 years
            extended_bounds: {
              min: 'now-2y/y',
              max: 'now/d',
            },
          },
        },
      },
    });

    res.json({
      explanation: `Date histogram: counts applications grouped by ${interval}`,
      interval,
      trend: formatBuckets(result.aggregations.applications_trend.buckets),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// 3. NESTED / MULTI-LEVEL AGGREGATIONS — Drill-Down
//    Aggregations inside aggregations — like nested GROUP BY in SQL
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /api/agg/skills-by-location
 * For each location → top 5 skills of candidates there.
 *
 * ES concept: put a "terms" agg INSIDE another "terms" agg.
 * This creates a two-level tree: location → [skill, skill, ...]
 * SQL equivalent: GROUP BY location, skill  (but ES does it in one query)
 */
app.get('/api/agg/skills-by-location', async (req, res) => {
  try {
    const result = await es.search({
      index: INDEX,
      size: 0,
      aggs: {
        by_location: {
          terms: {
            field: 'location',
            size: 10,
          },
          aggs: {                          // <-- nested aggregation inside by_location
            top_skills: {
              terms: {
                field: 'skills.keyword',
                size: 5,
              },
            },
          },
        },
      },
    });

    // Shape the response for easy reading
    const drilldown = result.aggregations.by_location.buckets.map((loc) => ({
      location: loc.key,
      candidate_count: loc.doc_count,
      top_skills: formatBuckets(loc.top_skills.buckets),
    }));

    res.json({
      explanation: 'Nested aggregation: for each location, shows the top skills of candidates there',
      drilldown,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/agg/experience-by-status
 * For each status → avg, min, max experience years of candidates.
 *
 * ES concept: mix "terms" with "avg/min/max" sub-aggregations (metric aggs).
 * Metric aggs compute a single number from numeric fields within each bucket.
 */
app.get('/api/agg/experience-by-status', async (req, res) => {
  try {
    const result = await es.search({
      index: INDEX,
      size: 0,
      aggs: {
        by_status: {
          terms: { field: 'status' },
          aggs: {
            avg_experience: { avg: { field: 'experience_years' } },
            min_experience: { min: { field: 'experience_years' } },
            max_experience: { max: { field: 'experience_years' } },
          },
        },
      },
    });

    const breakdown = result.aggregations.by_status.buckets.map((b) => ({
      status: b.key,
      candidate_count: b.doc_count,
      experience_years: {
        avg: Math.round(b.avg_experience.value * 10) / 10,
        min: b.min_experience.value,
        max: b.max_experience.value,
      },
    }));

    res.json({
      explanation: 'Nested metric aggregation: avg/min/max experience years grouped by status',
      breakdown,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/agg/monthly-by-location
 * Three-level drill-down: month → location → count
 *
 * ES concept: date_histogram → terms (two levels deep).
 * Useful for heatmaps or stacked bar charts.
 */
app.get('/api/agg/monthly-by-location', async (req, res) => {
  try {
    const result = await es.search({
      index: INDEX,
      size: 0,
      aggs: {
        by_month: {
          date_histogram: {
            field: 'applied_at',
            calendar_interval: 'month',
            format: 'yyyy-MM',
          },
          aggs: {
            by_location: {
              terms: { field: 'location', size: 5 },
            },
          },
        },
      },
    });

    const result_data = result.aggregations.by_month.buckets.map((month) => ({
      month: month.key_as_string,
      total: month.doc_count,
      locations: formatBuckets(month.by_location.buckets),
    }));

    res.json({
      explanation: 'Three-level aggregation: applications per month, broken down by location',
      data: result_data,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// 4. ALL FACETS IN ONE CALL — Dashboard Endpoint
//    Runs all Terms aggregations in a single Elasticsearch request
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /api/agg/facets
 * Returns skills, locations, and status counts in one ES query.
 *
 * ES concept: you can define many top-level aggs in a single search call.
 * ES computes all of them in one pass — much more efficient than 3 calls.
 */
app.get('/api/agg/facets', async (req, res) => {
  try {
    const result = await es.search({
      index: INDEX,
      size: 0,
      aggs: {
        skills_facet:    { terms: { field: 'skills.keyword', size: 10 } },
        location_facet:  { terms: { field: 'location',       size: 20 } },
        status_facet:    { terms: { field: 'status' } },
      },
    });

    res.json({
      explanation: 'All facets in one query — skills, locations, and status counts',
      total_candidates: result.hits.total.value,
      facets: {
        skills:    formatBuckets(result.aggregations.skills_facet.buckets),
        locations: formatBuckets(result.aggregations.location_facet.buckets),
        statuses:  formatBuckets(result.aggregations.status_facet.buckets),
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Routes index ────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    service: 'ES Aggregations Demo API',
    endpoints: {
      'Terms Aggregation (Faceted Counts)': {
        'GET /api/agg/skills':     'Top skills across all candidates',
        'GET /api/agg/locations':  'Candidate count per location',
        'GET /api/agg/status':     'Candidate count per status',
        'GET /api/agg/facets':     'All three facets in one ES query',
      },
      'Date Histogram Aggregation (Trends)': {
        'GET /api/agg/applications-over-time':          'Applications per month (default)',
        'GET /api/agg/applications-over-time?interval=week': 'Applications per week',
      },
      'Nested Aggregations (Drill-Down)': {
        'GET /api/agg/skills-by-location':   'Top skills for each location',
        'GET /api/agg/experience-by-status': 'Avg/min/max experience per status',
        'GET /api/agg/monthly-by-location':  'Applications per month → per location',
      },
    },
  });
});

// ─── Start ───────────────────────────────────────────────────────────────────
const PORT = 3003;
app.listen(PORT, () => {
  console.log(`ES Aggregations API running at http://localhost:${PORT}`);
  console.log(`Visit http://localhost:${PORT} to see all available endpoints`);
});