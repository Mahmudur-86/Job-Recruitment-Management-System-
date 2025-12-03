const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },

    category: { type: String, default: "Full-time" },
    salary: { type: String, default: "Negotiable" },

    description: String,
    requirements: String,

    // MCQ per job
    mcqs: [
      {
        question: String,
        options: [String],
        correctOptionIndex: Number,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
