const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Job title is required'], trim: true },
    department: { type: String, trim: true },
    location: { type: String, trim: true },
    status: {
      type: String,
      enum: ['Open', 'Closed', 'On Hold'],
      default: 'Open',
    },
    openings: { type: Number, default: 1, min: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);