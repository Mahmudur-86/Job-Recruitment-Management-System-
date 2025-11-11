import React from 'react';

export default function ManageJobs() {
  const jobs = [
    { id: 1, title: 'Software Engineer', company: 'Tech Corp', posted: '2024-11-01', applicants: 45 }
   
  ];

  return (
    <div>
      <h3 className="text-xl font-semibold mb-6 text-gray-800">Manage Jobs</h3>
      <p className="text-gray-600 mb-6">Admin can see all job posts and delete jobs if necessary.</p>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Posted Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applicants</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {jobs.map(job => (
              <tr key={job.id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{job.title}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{job.company}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{job.posted}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{job.applicants}</td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button className="text-blue-600 hover:text-blue-800">View</button>
                  <button className="text-red-600 hover:text-red-800">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
