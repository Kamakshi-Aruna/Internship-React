const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/mongodb-concepts-demo")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Connection error:", err));

// Routes
app.use("/jobs",       require("./routes/jobs"));
app.use("/candidates", require("./routes/candidates"));

// Root — shows all available endpoints
app.get("/", (req, res) => {
  res.json({
    message: "MongoDB Concepts Demo API",
    endpoints: {
      "GET /jobs"                           : "Pagination + Sorting  →  ?page=1&limit=3&sortBy=salary&order=desc",
      "GET /jobs/stats"                     : "Aggregation ($match, $group, $project)",
      "GET /jobs/with-candidates"           : "Aggregation ($lookup — JOIN)",
      "GET /jobs/:id/candidates"            : "Populate (referenced documents)",
      "GET /candidates"                     : "Pagination + Sorting + Populate",
      "GET /candidates/:id"                 : "Single candidate with populated jobs",
      "GET /candidates/stats/by-experience" : "Aggregation (group by computed field)",
    },
  });
});

app.listen(3000, () => console.log("Server running at http://localhost:3000"));