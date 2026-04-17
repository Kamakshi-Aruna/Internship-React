// seed.js — Run this once to fill the database with sample data
// Usage: node seed/seed.js

const mongoose = require("mongoose");
const Job = require("../models/Job");
const Candidate = require("../models/Candidate");

async function seed() {
  await mongoose.connect("mongodb://localhost:27017/mongodb-concepts-demo");
  console.log("Connected to MongoDB");

  // Clear old data
  await Job.deleteMany({});
  await Candidate.deleteMany({});

  // Create Jobs
  const jobs = await Job.insertMany([
    { title: "Backend Developer",  company: "Google",   skills: ["Node.js", "MongoDB"],        salary: 120000, location: "Remote" },
    { title: "Frontend Developer", company: "Meta",     skills: ["React", "CSS"],              salary: 110000, location: "New York" },
    { title: "Full Stack Engineer",company: "Amazon",   skills: ["Node.js", "React", "AWS"],   salary: 130000, location: "Seattle" },
    { title: "DevOps Engineer",    company: "Netflix",  skills: ["Docker", "Kubernetes"],      salary: 140000, location: "Remote" },
    { title: "Data Engineer",      company: "Airbnb",   skills: ["Python", "Spark", "SQL"],    salary: 125000, location: "San Francisco" },
    { title: "Junior Developer",   company: "StartupX", skills: ["JavaScript"],               salary:  60000, location: "Remote" },
    { title: "Senior Developer",   company: "Microsoft",skills: ["C#", "Azure"],               salary: 150000, location: "Redmond" },
  ]);

  console.log(`Created ${jobs.length} jobs`);

  // Create Candidates — each applies to 1 or 2 jobs (stores Job _ids)
  await Candidate.insertMany([
    { name: "Alice",   email: "alice@email.com",   skills: ["Node.js", "MongoDB"],  experienceYears: 4, appliedJobs: [jobs[0]._id, jobs[2]._id] },
    { name: "Bob",     email: "bob@email.com",     skills: ["React", "CSS"],        experienceYears: 2, appliedJobs: [jobs[1]._id] },
    { name: "Charlie", email: "charlie@email.com", skills: ["Docker","Kubernetes"], experienceYears: 5, appliedJobs: [jobs[3]._id] },
    { name: "Diana",   email: "diana@email.com",   skills: ["Python", "SQL"],       experienceYears: 3, appliedJobs: [jobs[4]._id] },
    { name: "Eve",     email: "eve@email.com",     skills: ["JavaScript"],          experienceYears: 1, appliedJobs: [jobs[5]._id] },
    { name: "Frank",   email: "frank@email.com",   skills: ["Node.js", "React"],    experienceYears: 6, appliedJobs: [jobs[0]._id, jobs[1]._id, jobs[2]._id] },
    { name: "Grace",   email: "grace@email.com",   skills: ["C#", "Azure"],         experienceYears: 7, appliedJobs: [jobs[6]._id] },
  ]);

  console.log("Created 7 candidates");
  console.log("Seed complete!");
  await mongoose.disconnect();
}

seed().catch(console.error);