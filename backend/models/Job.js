// models/Job.js
const mongoose = require("mongoose");

const mcqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    options: {
      type: [String],
      required: true,
      validate: (v) => Array.isArray(v) && v.length === 4,
    },
    correctOption: { type: Number, required: true, min: 0, max: 3 },
  },
  { _id: false }
);

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // DB uses "title"
    company: { type: String, required: true },
    location: { type: String, required: true },
    category: { type: String, default: "Full-time" },
    salary: { type: String, default: "Negotiable" },
    description: { type: String, default: "" },
    requirements: { type: String, default: "" },
    vacancies: { type: Number, default: 2 },

    //  job-wise interview mcqs (Admin will manage)
    mcqs: { type: [mcqSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
