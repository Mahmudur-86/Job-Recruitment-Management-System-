import React from "react";

export default function AddJobModal({
  open,
  onClose,
  onCreate,
  newJob,
  updateJobField,
  addError,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white w-full max-w-3xl rounded-xl shadow-lg border">
        <div className="p-4 border-b flex items-start justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-900">Add Job</h4>
            <p className="text-sm text-gray-600">
              Only job data (interview questions separate)
            </p>
          </div>

         
        </div>

        <div className="p-4 space-y-5 max-h-[75vh] overflow-y-auto">
          {addError && (
            <div className="p-3 rounded-md border border-red-200 bg-red-50 text-red-700 text-sm">
              {addError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              className="border rounded-md px-3 py-2"
              placeholder="Job Title"
              value={newJob.jobTitle}
              onChange={(e) => updateJobField("jobTitle", e.target.value)}
            />
            <input
              className="border rounded-md px-3 py-2"
              placeholder="Company"
              value={newJob.company}
              onChange={(e) => updateJobField("company", e.target.value)}
            />
            <input
              className="border rounded-md px-3 py-2"
              placeholder="Location"
              value={newJob.location}
              onChange={(e) => updateJobField("location", e.target.value)}
            />
            <input
              className="border rounded-md px-3 py-2"
              placeholder="Category"
              value={newJob.category}
              onChange={(e) => updateJobField("category", e.target.value)}
            />
            <input
              className="border rounded-md px-3 py-2"
              placeholder="Salary"
              value={newJob.salary}
              onChange={(e) => updateJobField("salary", e.target.value)}
            />
            <input
              type="number"
              className="border rounded-md px-3 py-2"
              placeholder="Vacancies"
              value={newJob.vacancies}
              onChange={(e) => updateJobField("vacancies", e.target.value)}
            />
          </div>

          <textarea
            className="border rounded-md px-3 py-2 w-full"
            rows={3}
            placeholder="Description"
            value={newJob.description}
            onChange={(e) => updateJobField("description", e.target.value)}
          />

          <textarea
            className="border rounded-md px-3 py-2 w-full"
            rows={3}
            placeholder="Requirements"
            value={newJob.requirements}
            onChange={(e) => updateJobField("requirements", e.target.value)}
          />
        </div>

        <div className="p-4 border-t flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onCreate}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Create Job
          </button>
        </div>
      </div>
    </div>
  );
}
