// ─────────────────────────────────────────────────────────────────
// CRUD Operations with Mongoose
//
// CREATE  → Model.create()  /  new Model().save()
// READ    → Model.find()  |  Model.findById()  |  Model.findOne()
// UPDATE  → Model.findByIdAndUpdate()  /  Model.updateOne()
// DELETE  → Model.findByIdAndDelete()  /  Model.deleteOne()
//
// Query options:
//   { new: true }       → return the updated document (not the old one)
//   { runValidators: true } → run schema validators on update
//   projection string   → "firstName email -_id" (include/exclude fields)
// ─────────────────────────────────────────────────────────────────

const Candidate = require("../models/Candidate");

// ── CREATE ───────────────────────────────────────────────────────

/**
 * Insert a single candidate.
 * Mongoose validates against the schema before saving.
 */
async function createCandidate(data) {
  const candidate = await Candidate.create(data);
  console.log("Created:", candidate._id, candidate.fullName);
  return candidate;
}

/**
 * Insert many candidates at once.
 * insertMany() skips duplicate-key errors per document (ordered: false).
 */
async function createMany(dataArray) {
  const result = await Candidate.insertMany(dataArray, { ordered: false });
  console.log(`Inserted ${result.length} candidates`);
  return result;
}

// ── READ ─────────────────────────────────────────────────────────

/**
 * Return all candidates, sorted newest-first.
 * Projection: only return firstName, lastName, email, status.
 */
async function findAll() {
  const candidates = await Candidate.find(
    {},                                    // filter  → {} means "all"
    "firstName lastName email status"      // projection → fields to include
  ).sort({ createdAt: -1 });

  console.log(`Found ${candidates.length} candidates`);
  return candidates;
}

/**
 * Find a single candidate by MongoDB _id.
 */
async function findById(id) {
  const candidate = await Candidate.findById(id);
  if (!candidate) console.log("No candidate found with id:", id);
  return candidate;
}

/**
 * Find candidates by status (e.g. "interviewing").
 */
async function findByStatus(status) {
  return Candidate.find({ status });
}

/**
 * Case-insensitive partial search on firstName.
 * Regex queries are powerful but avoid on large unindexed collections.
 */
async function searchByName(name) {
  return Candidate.find({
    firstName: { $regex: name, $options: "i" },
  });
}

// ── UPDATE ───────────────────────────────────────────────────────

/**
 * Update a candidate by _id.
 * - { new: true }           → return the modified document
 * - { runValidators: true } → enforce schema rules on the update payload
 */
async function updateCandidate(id, updates) {
  const updated = await Candidate.findByIdAndUpdate(
    id,
    updates,
    { new: true, runValidators: true }
  );
  console.log("Updated:", updated?._id);
  return updated;
}

/**
 * Update every candidate whose status matches oldStatus → newStatus.
 * updateOne() / updateMany() return { matchedCount, modifiedCount }.
 */
async function bulkStatusUpdate(oldStatus, newStatus) {
  const result = await Candidate.updateMany(
    { status: oldStatus },
    { $set: { status: newStatus } }
  );
  console.log(`Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);
  return result;
}

// ── DELETE ───────────────────────────────────────────────────────

/**
 * Delete a candidate by _id.
 * Returns the deleted document (or null if not found).
 */
async function deleteCandidate(id) {
  const deleted = await Candidate.findByIdAndDelete(id);
  console.log("Deleted:", deleted?._id);
  return deleted;
}

/**
 * Delete all candidates with "rejected" status.
 * deleteMany() returns { deletedCount }.
 */
async function deleteRejected() {
  const result = await Candidate.deleteMany({ status: "rejected" });
  console.log(`Deleted ${result.deletedCount} rejected candidates`);
  return result;
}

module.exports = {
  createCandidate,
  createMany,
  findAll,
  findById,
  findByStatus,
  searchByName,
  updateCandidate,
  bulkStatusUpdate,
  deleteCandidate,
  deleteRejected,
};