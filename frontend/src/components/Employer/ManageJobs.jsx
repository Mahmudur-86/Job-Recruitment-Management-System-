

export default function ManageJobs({ setCurrentPage, jobs, setJobs }) {
  return (
    <div className="min-h-screen bg-gray-100">
     

      <div className="container mx-auto p-8">
        <button 
          onClick={() => setCurrentPage('dashboard')} 
          className="mb-4 text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </button>

        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Manage Jobs</h2>

          <div className="space-y-4">
            {jobs.map(job => (
              <div key={job.id} className="bg-white p-6 rounded-lg shadow-md">
                
                <div className="flex justify-between items-start">
                  
                  {/* LEFT SIDE — FULL JOB DETAILS */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{job.title}</h3>

                    <p className="text-gray-600">{job.company}</p>
                    <p className="text-gray-600">📍 {job.location}</p>
                    <p className="text-gray-600">🏢 Department: {job.department}</p>

                    <p className="mt-3 text-gray-700">
                      <strong>Description:</strong> {job.description}
                    </p>

                    <p className="mt-2 text-gray-700">
                      <strong>Requirements:</strong> {job.requirements}
                    </p>

                    <div className="mt-3 flex gap-4 text-sm text-gray-600">
                      <span>💰 {job.salary}</span>
                      <span>📅 Deadline: {job.deadline}</span>
                      <span>📋 {job.applications} applications</span>
                    </div>
                  </div>

                  {/* RIGHT SIDE — ACTION BUTTONS */}
                  <div className="flex flex-col gap-2 ml-4">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                      Edit
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm('Delete this job?')) {
                          setJobs(jobs.filter(j => j.id !== job.id));
                        }
                      }}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>

                    <button
                      onClick={() => setCurrentPage('applications')}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      View Applications
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
