const mongoose = require("mongoose");

const RecruitmentLetterSchema = new mongoose.Schema(
  {
    jobSeekerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    companyName: { type: String, required: true, trim: true },
    companyAddress: { type: String, default: "", trim: true },
    companyPhone: { type: String, default: "", trim: true },
    companyEmail: { type: String, default: "", trim: true },

    letterRefNo: { type: String, required: true, trim: true },
    issueDate: { type: String, required: true, trim: true }, // YYYY-MM-DD

    candidateName: { type: String, required: true, trim: true },
    candidateAddress: { type: String, default: "", trim: true },
    candidateEmail: { type: String, default: "", trim: true },

    subject: { type: String, default: "Recruitment Letter", trim: true },

    positionTitle: { type: String, required: true, trim: true },
    department: { type: String, default: "", trim: true },
    startDate: { type: String, default: "", trim: true },
    employmentType: { type: String, default: "Full-time", trim: true },
    workLocation: { type: String, default: "On-site", trim: true },
    officeAddress: { type: String, default: "", trim: true },

    salaryAmount: { type: String, default: "", trim: true },
    salaryFrequency: { type: String, default: "per month", trim: true },
    probationPeriod: { type: String, default: "", trim: true },
    workingHours: { type: String, default: "", trim: true },
    reportingTo: { type: String, default: "", trim: true },

    extraTerms: { type: String, default: "", trim: true },

    hrName: { type: String, required: true, trim: true },
    hrTitle: { type: String, required: true, trim: true },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true,
    },
    publishedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RecruitmentLetter", RecruitmentLetterSchema);
