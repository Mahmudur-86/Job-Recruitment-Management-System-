import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ManageApplicants() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const adminToken = localStorage.getItem("adminToken");

        // Fetching all job applications for the Admin
        const response = await axios.get(
          "http://localhost:5000/api/job-applications/admin", // Admin endpoint to fetch all applications
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
            },
          }
        );

        setApplications(response.data.applications); // Store applications
      } catch (error) {
        console.error("Error fetching applications for Admin:", error);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div>
      <h3 className="text-xl font-semibold mb-6 text-gray-800">Manage Applicants</h3>
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
            {applications.map((app) => (
              <tr key={app._id}>
                <td className="px-6 py-4 text-sm text-gray-900">{app.user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{app.jobTitle}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{app.company}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <span className={`px-2 py-1 text-xs rounded-full ${app.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>{app.status}</span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-blue-600">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
