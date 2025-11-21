import React, { useState } from 'react';
import { Search } from 'lucide-react';
import JobCard from './JobCard';

export default function BrowseJobsTab({ jobs = [], onApplyNow }) {

  const [filters, setFilters] = useState({
    title: '',
    company: '',
    location: ''
  });

  
  const demoJobs = [
    {
      id: 1,
      title: 'Frontend Developer',
      company: 'Tech Corp',
      location: 'Dhaka',
      department: 'Engineering',
      category: 'Full-time',
      salary: 'Negotiable',
      description: 'Looking for an experienced frontend developer',
      requirements: 'React, JavaScript, CSS',
      mcqs: []
    },
  ];

  // Use employer jobs 
  const jobList = jobs.length > 0 ? jobs : demoJobs;

  // Filter only by title + company + location
  const filteredJobs = jobList.filter(job => {
    const title = job.title.toLowerCase();
    const company = job.company.toLowerCase();
    const location = job.location.toLowerCase();

    return (
      (!filters.title || title.includes(filters.title.toLowerCase())) &&
      (!filters.company || company.includes(filters.company.toLowerCase())) &&
      (!filters.location || location.includes(filters.location.toLowerCase()))
    );
  });

  // Clear filters
  const clearFilters = () => {
    setFilters({ title: '', company: '', location: '' });
  };

  return (
    <div>

      {/* Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Search size={20} /> Search Jobs
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          
          {/* Search by Title */}
          <input
            type="text"
            placeholder="Job Title (e.g., Frontend)"
            value={filters.title}
            onChange={(e) => setFilters({ ...filters, title: e.target.value })}
            className="p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* Search by Company */}
          <input
            type="text"
            placeholder="Company (e.g., Tech Corp)"
            value={filters.company}
            onChange={(e) => setFilters({ ...filters, company: e.target.value })}
            className="p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* Search by Location */}
          <input
            type="text"
            placeholder="Location (e.g., Dhaka)"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            className="p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {(filters.title || filters.company || filters.location) && (
          <button
            onClick={clearFilters}
            className="mt-3 text-sm text-blue-600 hover:text-blue-800"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Job List */}
      <div className="space-y-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map(job => (
            <JobCard key={job.id} job={job} onApplyNow={onApplyNow} />
          ))
        ) : (
          <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
            No matching jobs found.
          </div>
        )}
      </div>

    </div>
  );
}
