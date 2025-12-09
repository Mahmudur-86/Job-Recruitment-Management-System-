const mongoose = require('mongoose'); // ADD this line

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    category: { type: String, default: "Full-time" },
    salary: { type: String, default: "Negotiable" },
    description: String,
    requirements: String,
   
    vacancies: { type: Number, default: 2 },  
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
