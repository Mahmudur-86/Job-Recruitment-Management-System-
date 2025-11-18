import React, { useState } from 'react';



export default function InterviewModal({job, profile, onClose, onSubmit, applicationId}) {
const [interviewAnswers, setInterviewAnswers] = useState({});

  const interviewQuestions = [
    'Why do you want to work for this company?',
    'What are your greatest strengths?',
    'Describe a challenging project you worked on.',
    'Where do you see yourself in 5 years?'
  ];

  const handleSubmit = () => {
    const answers = Object.values(interviewAnswers);
    const score = answers.filter(a => a && a.trim().length > 20).length;
    const maxScore = interviewQuestions.length;

    const applicationData = {
      id: applicationId,
      jobTitle: job.title,
      company: job.company,
      appliedDate: new Date().toLocaleDateString(),
      status: score === maxScore ? 'pending' : 'rejected',
      score: score,
      maxScore: maxScore
    };

    // Simulate employer notification
    const employerMsg = `New Application Received!\n\nJob: ${job.title}\nApplicant: ${profile.name}\nEmail: ${profile.email}\nScore: ${score}/${maxScore}\nCV: ${profile.cv ? 'Attached' : 'Not Uploaded'}\n\nStatus: ${score === maxScore ? 'Review Required' : 'Low Score - Auto Rejected'}`;

    alert(`Application Submitted!\n\nYour Score: ${score}/${maxScore}\n\n--- Employer Dashboard (Demo) ---\n${employerMsg}`);

    onSubmit(applicationData);
  };

  const isAnswerValid = (answer) => {
    return answer && answer.trim().length >= 20;
  };

  const allAnswersValid = interviewQuestions.every((_, i) => isAnswerValid(interviewAnswers[i]));

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Interview Questions</h2>
        <p className="text-gray-600 mb-2">
          Job: <strong className="text-blue-600">{job?.title}</strong> at {job?.company}
        </p>

        {/* Warning Box */}
        <div className="text-sm text-gray-700 mb-4 bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
          <strong>Important:</strong> Answer all questions with at least 20 characters each to maximize your score!
        </div>

        {/* Questions */}
        <div className="space-y-5">
          {interviewQuestions.map((q, i) => (
            <div key={i} className="border-b pb-4 last:border-b-0">
              <label className="block font-medium text-gray-800 mb-2">
                {i + 1}. {q}
              </label>
              <textarea
                value={interviewAnswers[i] || ''}
                onChange={(e) =>
                  setInterviewAnswers({ ...interviewAnswers, [i]: e.target.value })
                }
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                rows="3"
                placeholder="Type your answer here..."
              />
              <div className="flex justify-between items-center mt-1 text-xs">
                <p
                  className={`font-medium ${
                    isAnswerValid(interviewAnswers[i]) ? 'text-green-600' : 'text-gray-500'
                  }`}
                >
                  {(interviewAnswers[i] || '').length} characters
                  {isAnswerValid(interviewAnswers[i]) && ' Checkmark'}
                </p>
                {!isAnswerValid(interviewAnswers[i]) && interviewAnswers[i] && (
                  <p className="text-red-500">
                    Need {20 - (interviewAnswers[i] || '').length} more characters
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSubmit}
            disabled={!allAnswersValid}
            className={`flex-1 py-2 px-6 rounded font-semibold transition ${
              allAnswersValid
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
      </div>
    </div>
  );
};








