import React, { useState, useEffect } from 'react';

export default function InterviewModal({ job, profile, onClose, onSubmit, applicationId }) {

  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [cvLink, setCvLink] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // Default MCQs
  const defaultMcqs = [
    {
      question: "What is React?",
      options: ["A JS library", "A Database", "An OS", "A framework"],
      correctOptionIndex: 0
    },
    {
      question: "What is Node.js used for?",
      options: ["Frontend", "Backend", "CSS", "SQL"],
      correctOptionIndex: 1
    },
    {
      question: "Which one is NoSQL?",
      options: ["MySQL", "Oracle", "MongoDB", "PostgreSQL"],
      correctOptionIndex: 2
    },
    {
      question: "Tailwind is used for?",
      options: ["API", "Design", "Hosting", "Database"],
      correctOptionIndex: 1
    }
  ];

  const finalMcqs = job?.mcqs?.length > 0 ? job.mcqs : defaultMcqs;
  const allAnswered = finalMcqs.every((_, i) => selectedAnswers[i] !== undefined);

  // Auto close after success
  useEffect(() => {
    if (submitted) {
      setTimeout(() => {
        onClose();
      }, 1800); // 1.8 seconds
    }
  }, [submitted]);

  const handleMcqSelect = (qIndex, optIndex) => {
    setSelectedAnswers({ ...selectedAnswers, [qIndex]: optIndex });
  };

  const handleSubmit = () => {
    const total = finalMcqs.length;
    let correct = 0;

    finalMcqs.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctOptionIndex) correct++;
    });

    const scorePercent = Math.round((correct / total) * 100);

    const applicationData = {
      id: applicationId,
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      appliedDate: new Date().toLocaleDateString(),
      name: profile?.name || "Anonymous",
      email: profile?.email || "N/A",
      cv: cvLink?.name || "PDF File",
      correctCount: correct,
      totalQuestions: total,
      score: scorePercent,
      status: scorePercent >= 80 ? "Shortlisted" : "Review"
    };

    onSubmit(applicationData);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">

        {/* SUCCESS MESSAGE */}
        {submitted ? (
          <div className="text-center py-10 animate-fade-in">
            <div className="text-green-600 text-6xl font-bold mb-4">✔</div>
            <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
            <p className="text-gray-600">Redirecting...</p>
          </div>
        ) : (
          <>

            <h2 className="text-2xl font-bold mb-2">Interview Questions</h2>
            <p className="text-gray-600 mb-4">
              Applying for <strong>{job.title}</strong> at {job.company}
            </p>

            {/* CV Upload */}
            <div className="mb-6">
              <label className="text-sm font-semibold text-gray-700 mb-1 block">
                Upload Your CV (PDF Only)
              </label>

              <input
                id="cv-upload"
                type="file"
                accept="application/pdf"
                onChange={(e) => setCvLink(e.target.files[0])}
                className="hidden"
              />

              <label
                htmlFor="cv-upload"
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500 transition"
              >
                <p className="text-gray-700 text-sm">
                  <span className="font-semibold text-blue-600">Click here</span> to upload your CV
                </p>
                <p className="text-xs text-gray-400 mt-1">(PDF format only)</p>
              </label>

              {cvLink && (
                <p className="text-sm text-green-700 mt-2 font-medium">
                  📄 Selected: {cvLink.name}
                </p>
              )}
            </div>

            {/* MCQs */}
            <div className="space-y-5 mb-4">
              {finalMcqs.map((q, qIndex) => (
                <div key={qIndex} className="border-b pb-4">
                  <p className="font-medium text-gray-800 mb-2">
                    {qIndex + 1}. {q.question}
                  </p>

                  {q.options.map((opt, optIndex) => (
                    <label key={optIndex} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name={`mcq-${qIndex}`}
                        checked={selectedAnswers[qIndex] === optIndex}
                        onChange={() => handleMcqSelect(qIndex, optIndex)}
                      />
                      {String.fromCharCode(65 + optIndex)}. {opt}
                    </label>
                  ))}
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-4">

              <button
                onClick={handleSubmit}
                disabled={!allAnswered || !cvLink}
                className={`flex-1 py-2 px-6 rounded font-semibold ${
                  allAnswered && cvLink
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Submit Application
              </button>

              <button
                onClick={() => {
                  setSelectedAnswers({});
                  setCvLink(null);
                  onClose();
                }}
                className="px-6 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>

            </div>

          </>
        )}
      </div>
    </div>
  );
}
