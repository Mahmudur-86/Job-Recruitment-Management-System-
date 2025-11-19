import React, { useState } from 'react';

export default function InterviewModal({ job, profile, onClose, onSubmit, applicationId }) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [cvLink, setCvLink] = useState(profile?.cv || '');

  const hasMcqs = job?.mcqs && job.mcqs.length > 0;

  const handleMcqSelect = (qIndex, optIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [qIndex]: optIndex,
    });
  };

  const allMcqAnswered = hasMcqs
    ? job.mcqs.every((_, idx) => selectedAnswers[idx] !== undefined)
    : false;

  const handleSubmit = () => {
    if (!hasMcqs) {
      alert('No interview questions found for this job.');
      return;
    }

    const totalQuestions = job.mcqs.length;
    let correctCount = 0;

    job.mcqs.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctOptionIndex) {
        correctCount += 1;
      }
    });

    const scorePercent = Math.round((correctCount / totalQuestions) * 100);

    const applicationData = {
      id: applicationId,
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      appliedDate: new Date().toLocaleDateString(),
      name: profile?.name || 'Anonymous',
      email: profile?.email || 'N/A',
      cv: cvLink,
      correctCount,
      totalQuestions,
      score: scorePercent,
      status: scorePercent >= 80 ? 'Shortlisted' : 'Review',
    };

    alert(
      `Application Submitted!\n\n` +
      `Correct: ${correctCount}/${totalQuestions}\n` +
      `Score: ${scorePercent}%`
    );

    onSubmit(applicationData);
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Interview Questions</h2>
        <p className="text-gray-600 mb-2">
          Job: <strong className="text-blue-600">{job?.title}</strong> at {job?.company}
        </p>

        {/* CV LINK */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CV / Resume Link (Google Drive, PDF URL, etc.)
          </label>
          <input
            type="text"
            value={cvLink}
            onChange={(e) => setCvLink(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Paste your CV link here..."
          />
        </div>

        {!hasMcqs ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded text-sm text-gray-700">
            Employer did not set interview MCQs for this job.
          </div>
        ) : (
          <>
            {/* Questions */}
            <div className="space-y-5 mb-4">
              {job.mcqs.map((q, qIndex) => (
                <div key={qIndex} className="border-b pb-4 last:border-b-0">
                  <p className="font-medium text-gray-800 mb-2">
                    {qIndex + 1}. {q.question}
                  </p>
                  <div className="space-y-2">
                    {q.options.map((opt, optIndex) => (
                      <label
                        key={optIndex}
                        className="flex items-center gap-2 text-sm cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={`mcq-${qIndex}`}
                          checked={selectedAnswers[qIndex] === optIndex}
                          onChange={() => handleMcqSelect(qIndex, optIndex)}
                        />
                        <span>
                          {String.fromCharCode(65 + optIndex)}. {opt || '(empty option)'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleSubmit}
                disabled={!allMcqAnswered || !cvLink}
                className={`flex-1 py-2 px-6 rounded font-semibold transition ${
                  allMcqAnswered && cvLink
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Submit Application
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded font-medium hover:bg-gray-50 transition"
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
