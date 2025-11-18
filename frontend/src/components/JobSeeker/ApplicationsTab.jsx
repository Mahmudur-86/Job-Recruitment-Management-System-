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
        <div className="space-y-3">
          {applications.map(app => (
            <div key={app.id} className="border p-4 rounded hover:shadow transition">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{app.jobTitle}</h3>
                  <p className="text-gray-600">{app.company}</p>
                  <p className="text-sm text-gray-500">Applied: {app.appliedDate}</p>
                  <p className="text-sm text-gray-700 mt-1">
                    Interview Score: <span className="font-semibold">{app.score}/{app.maxScore}</span>
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ${
                  app.status === 'pending' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {app.status.toUpperCase()}
                </span>
              </div>
              
              {app.status === 'pending' && (
                <div className="mt-3 p-2 bg-blue-50 rounded text-sm text-blue-700">
                   Your application is under review. You'll be notified once the employer responds.
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
