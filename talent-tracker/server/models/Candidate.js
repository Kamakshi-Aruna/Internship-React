const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, trim: true },
    status: {
      type: String,
      enum: ['Applied', 'Interview', 'Hired', 'Rejected'],
      default: 'Applied',
    },
    role: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Candidate', candidateSchema);