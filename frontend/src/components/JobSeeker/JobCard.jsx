import React from 'react';
import { MapPin, Building } from 'lucide-react';

export default function JobCard({ job, onApplyNow }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-xl font-bold text-blue-600">{job.title}</h3>
          <p className="text-gray-600 flex items-center gap-2 mt-1">
            <Building size={16} /> {job.company}
          </p>
        </div>
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
          {job.category}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-3 text-sm text-gray-600">
        <p className="flex items-center gap-1">
          <MapPin size={14} /> {job.location}
        </p>
        
        <p className="col-span-2 font-semibold text-green-600">💰 {job.salary}</p>
      </div>
      
      <p className="text-gray-700 mb-2">{job.description}</p>
      <p className="text-sm text-gray-600 mb-4">
        <strong>Requirements:</strong> {job.requirements}
      </p>
      
      <button
        onClick={() => onApplyNow(job)}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        Apply Now
      </button>
    </div>
  );
}
