// ─────────────────────────────────────────────────────────────────
// Entry point — runs all CRUD demos sequentially
// ─────────────────────────────────────────────────────────────────

const { connectDB, disconnectDB } = require("./src/db/connect");
const {
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
} = require("./src/operations/candidateOps");

async function runDemo() {
  await connectDB();

  console.log("\n═══════════════ CREATE ═══════════════");

  // Single insert
  const alice = await createCandidate({
    firstName: "Alice",
    lastName: "Smith",
    email: "alice@example.com",
    phone: "+1-555-0101",
    skills: ["JavaScript", "React", "Node.js"],
    experienceYears: 3,
    status: "applied",
  });

  // Bulk insert
  await createMany([
    {
      firstName: "Bob",
      lastName: "Jones",
      email: "bob@example.com",
      skills: ["Python", "Django"],
      experienceYears: 5,
      status: "interviewing",
    },
    {
      firstName: "Carol",
      lastName: "White",
      email: "carol@example.com",
      skills: ["Java", "Spring"],
      experienceYears: 7,
      status: "offered",
    },
    {
      firstName: "Dave",
      lastName: "Brown",
      email: "dave@example.com",
      skills: ["Go", "Kubernetes"],
      experienceYears: 2,
      status: "rejected",
    },
  ]);

  console.log("\n═══════════════ READ ═════════════════");

  const all = await findAll();
  console.log("All candidates:", all.map((c) => `${c.firstName} (${c.status})`));

  const found = await findById(alice._id);
  console.log("findById result:", found?.fullName); // virtual field

  const interviewing = await findByStatus("interviewing");
  console.log("Interviewing:", interviewing.map((c) => c.firstName));

  const searched = await searchByName("carol");
  console.log("Search 'carol':", searched.map((c) => c.firstName));

  console.log("\n═══════════════ UPDATE ═══════════════");

  // Update single document
  const updatedAlice = await updateCandidate(alice._id, {
    status: "interviewing",
    $push: { skills: "TypeScript" }, // MongoDB $push appends to an array
  });
  console.log("Alice new status:", updatedAlice?.status);
  console.log("Alice skills:", updatedAlice?.skills);

  // Bulk update — move everyone from "offered" → "hired"
  await bulkStatusUpdate("offered", "hired");

  console.log("\n═══════════════ DELETE ═══════════════");

  // Delete by id
  await deleteCandidate(alice._id);

  // Delete all rejected
  await deleteRejected();

  const remaining = await findAll();
  console.log(
    "Remaining candidates:",
    remaining.map((c) => `${c.firstName} (${c.status})`)
  );

  await disconnectDB();
}

runDemo().catch((err) => {
  console.error(err);
  process.exit(1);
});