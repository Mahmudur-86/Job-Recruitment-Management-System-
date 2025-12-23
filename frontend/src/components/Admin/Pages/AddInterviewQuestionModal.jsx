import React from "react";

export default function AddInterviewQuestionModal({
  open,
  onClose,
  jobs,
  iqJobId,
  setIqJobId,
  mcqForm,
  updateMcqField,
  updateMcqOption,
  onSave,
  iqError,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white w-full max-w-3xl rounded-xl shadow-lg border">
        <div className="p-4 border-b flex items-start justify-between">
          <div>
            <h4 className="text-lg font-semibold">Add Interview Question</h4>
            <p className="text-sm text-gray-500">Add 3 MCQ questions to a selected job</p>
          </div>
        </div>

        <div className="p-4 space-y-5 max-h-[75vh] overflow-y-auto">
          {iqError && (
            <div className="p-3 rounded-md border border-red-200 bg-red-50 text-red-700 text-sm">
              {iqError}
            </div>
          )}

          <select
            value={iqJobId}
            onChange={(e) => setIqJobId(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="">Select Job</option>
            {jobs.map((j) => (
              <option key={j._id} value={j._id}>
                {j.jobTitle} • {j.company}
              </option>
            ))}
          </select>

          {mcqForm.map((m, i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="flex justify-between mb-2 items-center gap-3">
                <p className="font-semibold">MCQ {i + 1}</p>

                <select
                  value={m.correctOption}
                  onChange={(e) =>
                    updateMcqField(i, "correctOption", Number(e.target.value))
                  }
                  className="border rounded-md px-2 py-1 text-sm"
                  title="Select correct option"
                >
                  <option value={0}>Correct: Option 1</option>
                  <option value={1}>Correct: Option 2</option>
                  <option value={2}>Correct: Option 3</option>
                  <option value={3}>Correct: Option 4</option>
                </select>
              </div>

              <input
                className="border rounded-md px-3 py-2 w-full"
                placeholder={`Question ${i + 1}`}
                value={m.question}
                onChange={(e) => updateMcqField(i, "question", e.target.value)}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                {m.options.map((op, idx) => (
                  <input
                    key={idx}
                    className="border rounded-md px-3 py-2"
                    placeholder={`Option ${idx + 1}`}
                    value={op}
                    onChange={(e) => updateMcqOption(i, idx, e.target.value)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Save Interview Questions
          </button>
        </div>
      </div>
    </div>
  );
}
