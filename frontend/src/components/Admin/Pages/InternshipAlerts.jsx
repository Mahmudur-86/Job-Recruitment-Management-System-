import React from 'react';

export default function InternshipAlerts() {
  const internships = [
   {
      
      company : "EconoTech",
      title: "Backend Developer Intern",
      department: "CSE",
      university: "MIT",
      status: "Pending",
      role: "Backend Developer",
      duration: "3 months",
      description: "This internship involves working on backend development using Node.js and MongoDB.",
      websiteName: "www.econotech.com"
    },
    {
      
      company: "Tech Innovators",
      title: "Frontend Developer Intern",
      department: "UI/UX Design",
      university: "Stanford",
      status: "Approved",
      role: "Frontend Developer",
      duration: "6 months",
      description: "Work with the design team to build interactive UI components using React.",
      websiteName: "www.techinnovators.com"
    },
   
  ];

  return (
    <div>
      <h3 className="text-xl font-semibold mb-6 text-gray-800"> Internship Alerts</h3>
      <p className="text-gray-600 mb-6">Admin verifies and approves employer-submitted internships alerts before sending to specific universities.</p>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
             
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
