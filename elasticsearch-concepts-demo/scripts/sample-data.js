/**
 * sample-data.js
 * Creates sample candidates in MongoDB if the collection is empty.
 * Run: node scripts/sample-data.js
 */

const mongoose = require("mongoose");

const MONGO_URI = "mongodb://localhost:27017/talent-tracker";

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

const sampleCandidates = [
  {
    name: "Alice Johnson",
    email: "alice@example.com",
    skills: ["React", "Node.js", "MongoDB"],
    location: "New York",
    experience_years: 4,
    status: "active",
    applied_at: new Date("2024-01-15"),
  },
  {
    name: "Bob Smith",
    email: "bob@example.com",
    skills: ["Java", "Spring Boot", "PostgreSQL"],
    location: "San Francisco",
    experience_years: 6,
    status: "active",
    applied_at: new Date("2024-02-10"),
  },
  {
    name: "Carol Williams",
    email: "carol@example.com",
    skills: ["Python", "Django", "React"],
    location: "New York",
    experience_years: 3,
    status: "active",
    applied_at: new Date("2024-03-05"),
  },
  {
    name: "David Lee",
    email: "david@example.com",
    skills: ["React", "TypeScript", "GraphQL"],
    location: "Austin",
    experience_years: 2,
    status: "inactive",
    applied_at: new Date("2024-01-20"),
  },
  {
    name: "Eva Martinez",
    email: "eva@example.com",
    skills: ["Vue.js", "Node.js", "MySQL"],
    location: "San Francisco",
    experience_years: 5,
    status: "active",
    applied_at: new Date("2024-04-01"),
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const count = await Candidate.countDocuments();
    if (count > 0) {
      console.log(`MongoDB already has ${count} candidates. Skipping seed.`);
      console.log("To re-seed, drop the candidates collection first.");
    } else {
      await Candidate.insertMany(sampleCandidates);
      console.log(`Inserted ${sampleCandidates.length} sample candidates into MongoDB`);
    }
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

seedDatabase();