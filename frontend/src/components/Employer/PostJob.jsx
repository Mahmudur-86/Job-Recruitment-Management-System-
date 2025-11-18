import { useState } from 'react';


export default function PostJob({ setCurrentPage, jobs, setJobs }) {

  const [job, setJob] = useState({
    title: '',
    company: '',
    location: '',
    category: 'Full-time',
    description: '',
    requirements: '',
    salary: '',
    deadline: '',
    department: ''
  });

  return (
    <div className="min-h-screen bg-gray-100">
     

      <div className="container mx-auto p-8">
        <button 
          onClick={() => setCurrentPage('dashboard')}
          className="mb-4 text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </button>

        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Post a Job</h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();

              setJobs([
                ...jobs,
                { 
                  ...job, 
                  id: jobs.length + 1, 
                  applications: 0 
                }
              ]);

              alert('Job posted successfully!');
              setCurrentPage('managejobs');
            }}
          >

            {/* Job Title */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">Job Title</label>
              <input
                type="text"
                value={job.title}
                onChange={(e) => setJob({ ...job, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Company Name */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">Company Name</label>
              <input
                type="text"
                value={job.company}
                onChange={(e) => setJob({ ...job, company: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>

            {/* Location */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">Location</label>
              <input
                type="text"
                value={job.location}
                onChange={(e) => setJob({ ...job, location: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>

            {/* Job Description */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">Job Description</label>
              <textarea
                value={job.description}
                onChange={(e) => setJob({ ...job, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                rows="4"
                required
              />
            </div>

            {/* Requirements */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">Requirements</label>
              <textarea
                value={job.requirements}
                onChange={(e) => setJob({ ...job, requirements: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="4"
                required
              />
            </div>

            {/* Salary Range */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">Salary Range</label>
              <input
                type="text"
                value={job.salary}
                onChange={(e) => setJob({ ...job, salary: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., $50k - $70k"
                required
              />
            </div>

            {/* Deadline */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">Application Deadline</label>
              <input
                type="date"
                value={job.deadline}
                onChange={(e) => setJob({ ...job, deadline: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Department */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium">Department</label>
              <input
                type="text"
                value={job.department}
                onChange={(e) => setJob({ ...job, department: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Post Job
            </button>

          </form>
        </div>
      </div>

    </div>
  );
}
