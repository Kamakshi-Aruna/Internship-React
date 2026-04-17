// =======================================================
//  FAKE DATA — replaces a real database for this demo
//  In Recruitly this would be a DB query (MongoDB/Postgres)
// =======================================================

const candidates = [
  { id: 1, name: "Alice Johnson", role: "Frontend Dev",  stage: "Interview", email: "alice@example.com",  experience: 3 },
  { id: 2, name: "Bob Smith",     role: "Backend Dev",   stage: "Applied",   email: "bob@example.com",    experience: 5 },
  { id: 3, name: "Carol White",   role: "DevOps",        stage: "Offer",     email: "carol@example.com",  experience: 7 },
  { id: 4, name: "David Lee",     role: "QA Engineer",   stage: "Rejected",  email: "david@example.com",  experience: 2 },
];

module.exports = candidates;