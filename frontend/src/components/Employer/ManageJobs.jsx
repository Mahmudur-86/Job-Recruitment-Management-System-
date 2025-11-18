import NavBar from './NavBar';

export default function ManageJobs({ setCurrentPage, jobs, setJobs }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="container mx-auto p-8">
        <button onClick={() => setCurrentPage('dashboard')} className="mb-4 text-blue-600 hover:underline">
          ← Back to Dashboard
        </button>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Manage Jobs</h2>
          <div className="space-y-4">
            {jobs.map(job => (
              <div key={job.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{job.title}</h3>
                    <p className="text-gray-600 mt-1">{job.department}</p>
                    <div className="mt-2 flex gap-4 text-sm text-gray-500">
                      <span>💰 {job.salary}</span>
                      <span>📅 Deadline: {job.deadline}</span>
                      <span>📋 {job.applications} applications</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
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
                      View Apps
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