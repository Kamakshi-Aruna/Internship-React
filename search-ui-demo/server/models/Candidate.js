const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema(
  {
    name:             { type: String, required: true, trim: true },
    email:            { type: String, trim: true, lowercase: true },
    phone:            { type: String, trim: true },
    role:             { type: String, trim: true },
    status:           { type: String, enum: ['Applied', 'Interview', 'Hired', 'Rejected'], default: 'Applied' },
    skills:           [{ type: String, trim: true }],
    location:         { type: String, trim: true },
    experience_years: { type: Number, default: 0 },
    bio:              { type: String, trim: true },
    applied_at:       { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Candidate', candidateSchema);