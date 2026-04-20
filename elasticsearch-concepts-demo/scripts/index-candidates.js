/**
 * index-candidates.js
 *
 * Reads candidate documents from MongoDB and indexes them into Elasticsearch.
 *
 * Steps:
 *  1. Connect to MongoDB
 *  2. Connect to Elasticsearch
 *  3. Create the "candidates" index with a mapping (if it does not exist)
 *  4. Fetch all candidates from MongoDB
 *  5. Bulk-index them into Elasticsearch
 *
 * Run: node scripts/index-candidates.js
 *
 * Prerequisites:
 *  - MongoDB running on localhost:27017
 *  - Elasticsearch running on localhost:9200 (use docker compose up -d)
 */

const mongoose = require("mongoose");
const { Client } = require("@elastic/elasticsearch");

// ── Config ─────────────────────────────────────────────────────────────────
const MONGO_URI = "mongodb://localhost:27017/talent-tracker";
const ES_NODE   = "http://localhost:9200";
const INDEX     = "candidates";

// ── Mongoose Model ──────────────────────────────────────────────────────────
const candidateSchema = new mongoose.Schema({
  name:             String,
  email:            String,
  skills:           [String],
  location:         String,
  experience_years: Number,
  status:           String,
  applied_at:       Date,
});

const Candidate = mongoose.model("Candidate", candidateSchema);

// ── Elasticsearch Mapping ───────────────────────────────────────────────────
// This tells ES what type each field is:
//   text   = full-text search (analyzed, broken into words)
//   keyword = exact match / filter / sort
//   integer = numeric range queries
//   date    = date range queries
const MAPPING = {
  mappings: {
    properties: {
      name: {
        type: "text",
        fields: { keyword: { type: "keyword" } }, // also store as keyword for exact sort
      },
      email:            { type: "keyword" },
      skills: {
        type: "text",
        fields: { keyword: { type: "keyword" } },
      },
      location:         { type: "keyword" },
      experience_years: { type: "integer" },
      status:           { type: "keyword" },
      applied_at:       { type: "date" },
    },
  },
};

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  // 1. Connect to MongoDB
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  // 2. Connect to Elasticsearch
  const esClient = new Client({ node: ES_NODE });
  await esClient.ping();
  console.log("Connected to Elasticsearch");

  // 3. Create the index with mapping (skip if it already exists)
  const indexExists = await esClient.indices.exists({ index: INDEX });
  if (indexExists) {
    console.log(`Index "${INDEX}" already exists — deleting and recreating...`);
    await esClient.indices.delete({ index: INDEX });
  }

  console.log(`Creating index "${INDEX}" with mapping...`);
  await esClient.indices.create({ index: INDEX, body: MAPPING });
  console.log("Index created successfully");

  // 4. Fetch all candidates from MongoDB
  const candidates = await Candidate.find({}).lean();
  console.log(`Fetched ${candidates.length} candidates from MongoDB`);

  if (candidates.length === 0) {
    console.log("No candidates found. Run: node scripts/sample-data.js first.");
    return;
  }

  // 5. Build bulk request body
  //    Each document needs TWO entries in the array:
  //      - { index: { _index, _id } }  ← tells ES which index and ID to use
  //      - { ...document fields }       ← the actual data
  const bulkBody = candidates.flatMap((c) => [
    { index: { _index: INDEX, _id: c._id.toString() } },
    {
      name:             c.name,
      email:            c.email,
      skills:           c.skills,
      location:         c.location,
      experience_years: c.experience_years,
      status:           c.status,
      applied_at:       c.applied_at,
    },
  ]);

  // 6. Send bulk request to Elasticsearch
  const result = await esClient.bulk({ body: bulkBody, refresh: true });

  if (result.errors) {
    const errorItems = result.items.filter((i) => i.index?.error);
    console.error("Some documents failed to index:", errorItems);
  } else {
    console.log(`Indexed ${candidates.length} documents into Elasticsearch`);
  }

  console.log("Done!");
}

main()
  .catch((err) => {
    console.error("Error:", err.message);
    process.exit(1);
  })
  .finally(async () => {
    await mongoose.disconnect();
  });