export default function AllJobs({ setCurrentPage, jobs, setJobs, setSelectedJob }) {
  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <button
        onClick={() => setCurrentPage("dashboard")}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back to Dashboard
      </button>

      <div className="max-w-4xl mx-auto">

        <h2 className="text-2xl font-bold mb-6">Your Posted Jobs</h2>

        <div className="space-y-4">

          {jobs.map(job => (
            <div key={job.id} className="bg-white p-6 rounded-lg shadow">

              <div className="flex justify-between items-start">

                {/* JOB INFO */}
                <div className="flex-1">
                  <p><strong>Status:</strong> {job.status}</p>
                  <h3 className="text-xl font-bold mt-1">
                    {job.title}
                  </h3>

                  <p><strong>Company:</strong> {job.company}</p>
                  <p><strong>Location:</strong> {job.location}</p>
                  <p><strong>Category:</strong> {job.category}</p>
                  <p><strong>Salary:</strong> {job.salary}</p>
                  <p className="mt-3"><strong>Description:</strong> {job.description}</p>
                  <p className="mt-2"><strong>Requirements:</strong> {job.requirements}</p>
                  <p><strong>Vacancies:</strong>{job.vacancies}</p>

                  {/* MCQ Status */}
                  <div className="mt-3">
                    {job.mcqs.length > 0 ? (
                      <p className="text-green-600 font-semibold">
                        {job.mcqs.length} MCQs Added
                      </p>
                    ) : (
                      <p className="text-red-500 font-semibold">
                        No MCQs Added Yet
                      </p>
                    )}
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex flex-col gap-2 ml-6">

                 <button
  onClick={() => {
    setSelectedJob(job);
    setCurrentPage("mcq");
  }}
  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
>
  {job.mcqs.length > 0 ? "Edit MCQs" : "Add MCQs"}
</button>

                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={() => {
                      if (window.confirm("Delete this job?")) {
                        setJobs(jobs.filter(j => j.id !== job.id));
                      }
                    }}
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>
          ))}

          {jobs.length === 0 && (
            <p className="text-gray-600 text-center py-6">
              No jobs posted yet.
            </p>
          )}

        </div>

      </div>
    </div>
  );
}
