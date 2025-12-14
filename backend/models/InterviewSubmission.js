const mongoose = require("mongoose");

const interviewSubmissionSchema = new mongoose.Schema(
  {
    interviewSetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InterviewSet",
      required: true,
    },
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    answers: [
      {
        questionIndex: { type: Number, required: true },
        selectedOptionIndex: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("InterviewSubmission", interviewSubmissionSchema);
