import { useState } from "react";

export default function AddMCQs({ setCurrentPage, jobs, setJobs, selectedJob }) {

  const [mcqs, setMcqs] = useState(
    selectedJob.mcqs.length > 0
      ? selectedJob.mcqs
      : [
          { question: "", options: ["", "", "", ""], correctOption: 0 },
          { question: "", options: ["", "", "", ""], correctOption: 0 },
          { question: "", options: ["", "", "", ""], correctOption: 0 },
        ]
  );

  //   success popup state
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedJobs = jobs.map((job) =>
      job.id === selectedJob.id ? { ...job, mcqs } : job
    );

    setJobs(updatedJobs);

    

    //  NEW: show popup + auto redirect
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setCurrentPage("alljobs");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 relative">
      <button
        onClick={() => setCurrentPage("alljobs")}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back to Jobs
      </button>

      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">
          Add Interview MCQs — {selectedJob.title}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mcqs.map((mcq, qIndex) => (
            <div key={qIndex} className="border p-4 rounded">
              <label className="font-semibold">Question {qIndex + 1}</label>
              <input
                type="text"
                value={mcq.question}
                onChange={(e) => {
                  const updated = [...mcqs];
                  updated[qIndex].question = e.target.value;
                  setMcqs(updated);
                }}
                className="w-full border p-2 rounded mt-2"
              />

              {mcq.options.map((opt, optIndex) => (
                <div key={optIndex} className="flex items-center gap-2 mt-2">
                  <span>{String.fromCharCode(65 + optIndex)}.</span>
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const updated = [...mcqs];
                      updated[qIndex].options[optIndex] = e.target.value;
                      setMcqs(updated);
                    }}
                    className="flex-1 border p-2 rounded"
                  />
                </div>
              ))}

              <select
                value={mcq.correctOption}
                onChange={(e) => {
                  const updated = [...mcqs];
                  updated[qIndex].correctOption = Number(e.target.value);
                  setMcqs(updated);
                }}
                className="mt-2 border p-2 rounded"
              >
                <option value={0}>Correct: A</option>
                <option value={1}>Correct: B</option>
                <option value={2}>Correct: C</option>
                <option value={3}>Correct: D</option>
              </select>
            </div>
          ))}

          <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
            Save MCQs
          </button>
        </form>
      </div>

      {/*  SUCCESS POPUP MODAL */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full text-center">
            <p className="text-lg font-semibold text-green-600 mb-2">
              MCQs saved successfully!
            </p>
            <p className="text-sm text-gray-600">
              Redirecting to All Jobs...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
