// ─────────────────────────────────────────────────────────────────
// MongoDB Data Modelling with Mongoose
//
// DOCUMENT  → a single record (like a row in SQL)
// COLLECTION → a group of documents (like a table in SQL)
// SCHEMA    → defines the shape + validation rules of a document
// MODEL     → a class built from a schema; used to query the collection
//
// Mongoose Schema types:
//   String, Number, Boolean, Date, Array, ObjectId, Mixed
//
// Validation options:
//   required  → field must be present
//   minlength / maxlength → string length bounds
//   min / max → number bounds
//   enum      → allowed values list
//   match     → regex pattern
//   default   → value used when field is omitted
// ─────────────────────────────────────────────────────────────────

const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
  {
    // ── Personal info ───────────────────────────────────────────
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters"],
      maxlength: [50, "First name cannot exceed 50 characters"],
    },

    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: [2, "Last name must be at least 2 characters"],
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,               // MongoDB creates a unique index
      lowercase: true,            // auto-converts to lowercase before save
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },

    phone: {
      type: String,
      match: [/^\+?[\d\s\-()]{7,15}$/, "Please enter a valid phone number"],
    },

    // ── Professional info ───────────────────────────────────────
    skills: {
      type: [String],             // Array of strings
      default: [],
    },

    experienceYears: {
      type: Number,
      min: [0, "Experience cannot be negative"],
      max: [50, "Experience cannot exceed 50 years"],
      default: 0,
    },

    status: {
      type: String,
      enum: {
        values: ["applied", "interviewing", "offered", "hired", "rejected"],
        message: "{VALUE} is not a valid status",
      },
      default: "applied",
    },

    resumeUrl: {
      type: String,
      trim: true,
    },

    // ── Timestamps (added automatically by { timestamps: true }) ─
    // createdAt and updatedAt are added by Mongoose automatically
  },
  {
    timestamps: true,   // adds createdAt + updatedAt fields
    collection: "candidates", // explicit collection name (optional)
  }
);

// ── Virtual field (not stored in DB, computed on read) ──────────
// virtuals let you derive values from existing fields
candidateSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// ── Model ───────────────────────────────────────────────────────
// mongoose.model("Candidate", schema)
//   - 1st arg: model name (Mongoose lowercases + pluralises → "candidates" collection)
//   - 2nd arg: the schema
const Candidate = mongoose.model("Candidate", candidateSchema);

module.exports = Candidate;