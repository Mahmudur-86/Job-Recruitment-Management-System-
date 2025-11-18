import React from 'react';

export default function ManageApplicants() {
  const applications = [
   
  
    
  ];

  return (
    <div>
      <h3 className="text-xl font-semibold mb-6 text-gray-800">Manage Applicants</h3>
      <p className="text-gray-600 mb-6">Admin can view all job applications across the platform.</p>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applicant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
            
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {applications.map(app => (
              <tr key={app.id}>
                <td className="px-6 py-4 text-sm text-gray-900">{app.applicant}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{app.job}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{app.company}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{app.date}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${app.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>{app.status}</span>
                </td>
               
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
