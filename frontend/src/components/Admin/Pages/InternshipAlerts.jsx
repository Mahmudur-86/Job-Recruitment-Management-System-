import React from 'react';

export default function InternshipAlerts() {
  const internships = [
    { id: 1, company: 'StartUp Inc', title: ' Internship Program', university: 'IUBAT', submitted: '2024-11-01', status: 'Pending' },
    { id: 2, company: 'Innovation Labs', title: 'MERN Internship', university: 'Stanford', submitted: '2024-11-03', status: 'Approved' },
   
  ];

  return (
    <div>
      <h3 className="text-xl font-semibold mb-6 text-gray-800">View Internship Alerts</h3>
      <p className="text-gray-600 mb-6">Admin verifies and approves employer-submitted internships alerts before sending to specific universities.</p>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">University</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {internships.map(intern => (
              <tr key={intern.id}>
                <td className="px-6 py-4 text-sm text-gray-900">{intern.company}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{intern.title}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{intern.university}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{intern.submitted}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${intern.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{intern.status}</span>
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button className="text-green-600 hover:text-green-800">Approve</button>
                  <button className="text-red-600 hover:text-red-800">Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
