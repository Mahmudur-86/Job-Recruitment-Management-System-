// InterviewModal.jsx
{/*import React, { useState } from 'react';
import axios from 'axios';

export default function InterviewModal({ job, profile, onClose, onSubmit }) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [cvLink, setCvLink] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const finalMcqs = job?.mcqs || [];  // Default to an empty array if no MCQs.

  const handleSubmit = async () => {
    const mcqHistory = finalMcqs.map((q, index) => ({
      question: q.question,
      selectedOption: q.options[selectedAnswers[index]]
    }));

    const applicationData = {
      jobId: job._id,
      jobTitle: job.title,
      company: job.company,
      appliedDate: new Date().toLocaleDateString(),
      name: profile?.name || "Anonymous",
      email: profile?.email || "N/A",
      cvName: cvLink?.name || "UploadedCV.pdf",  // Save CV name
      mcqHistory,  // Save selected answers
      status: "Pending"
    };

    try {
      await axios.post('http://localhost:5000/api/job-applications', applicationData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setSubmitted(true);
      onSubmit(applicationData);
    } catch (error) {
      console.error('Error submitting application:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {submitted ? (
          <div className="text-center py-10 animate-fade-in">
            <div className="text-green-600 text-6xl font-bold mb-4">✔</div>
            <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
            <p className="text-gray-600">Redirecting...</p>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-2">Interview Questions</h2>
            <p className="text-gray-600 mb-4">
              Applying for <strong>{job.title}</strong> at {job.company}
            </p>

            
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
                  <span className="font-semibold text-blue-600">Click here</span> to upload your updated CV 
                </p>
              </label>
            </div>

          
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
                        onChange={() => setSelectedAnswers({ ...selectedAnswers, [qIndex]: optIndex })}
                      />
                      {String.fromCharCode(65 + optIndex)}. {opt}
                    </label>
                  ))}
                </div>
              ))}
            </div>

           
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleSubmit}
                disabled={!cvLink || Object.values(selectedAnswers).length !== finalMcqs.length}
                className="flex-1 py-2 px-6 rounded font-semibold bg-blue-600 text-white hover:bg-blue-700"
              >
                Submit Application
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} */}
