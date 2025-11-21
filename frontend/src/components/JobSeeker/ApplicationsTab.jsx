import React from 'react';
import { Briefcase } from 'lucide-react';

export default function ApplicationsTab({ applications }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Briefcase size={24} /> My Applications
      </h2>

      {applications.length === 0 ? (
        <div className="text-center py-8">
          <Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No applications yet. Start browsing jobs!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div 
              key={app.id} 
              className="border p-4 rounded-lg bg-white shadow-sm hover:shadow transition"
            >
              
              {/* Header */}
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-xl text-blue-700">
                    {app.jobTitle}
                  </h3>
                  <p className="text-gray-600">{app.company}</p>
                  <p className="text-gray-500 text-sm">
                    Applied on: <strong>{app.appliedDate}</strong>
                  </p>
                </div>

                {/* Status */}
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    app.status === "Shortlisted"
                      ? "bg-green-100 text-green-800"
                      : app.status === "Rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {app.status}
                </span>
              </div>

              {/* CV link */}
              <p className="text-gray-700 text-sm mt-1">
                <strong>CV:</strong>{" "}
                {app.cv ? (
                  <span className="text-gray-800 font-medium">
                    {app.cv}
                  </span>
                ) : (
                  "Not provided"
                )}
              </p>

              <div className="mt-3 p-2 bg-blue-50 rounded text-sm text-blue-700">
                Your application has been received and is under review.
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
