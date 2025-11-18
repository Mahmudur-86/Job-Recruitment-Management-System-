import React, { useState } from 'react';
import { Search } from 'lucide-react';
import JobCard from './JobCard';



export default function BrowseJobsTab({ onApplyNow }) {
  const [filters, setFilters] = useState({ 
    department: '', 
    location: '', 
    company: '' 
  });

const demoJobs = [
    {
      id: 1,
      title: 'Frontend Developer',
      company: 'Tech Corp',
      location: 'New York',
      department: 'Engineering',
      category: 'Full-time',
      salary: '$80,000 - $100,000',
      description: 'Looking for an experienced frontend developer...',
      requirements: 'React, JavaScript, CSS'
    },
 
  ];

  const filteredJobs = demoJobs.filter(job => {
    return (!filters.department || job.department.toLowerCase().includes(filters.department.toLowerCase())) &&
           (!filters.location || job.location.toLowerCase().includes(filters.location.toLowerCase())) &&
           (!filters.company || job.company.toLowerCase().includes(filters.company.toLowerCase()));
  });

  const clearFilters = () => {
    setFilters({ department: '', location: '', company: '' });
  };

  return (
    <div>
      {/* Filters Section */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Search size={20} /> Filter Jobs
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Department (e.g., Engineering)"
            value={filters.department}
            onChange={(e) => setFilters({...filters, department: e.target.value})}
            className="p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="text"
            placeholder="Location (e.g., New York)"
            value={filters.location}
            onChange={(e) => setFilters({...filters, location: e.target.value})}
            className="p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="text"
            placeholder="Company (e.g., Tech Corp)"
            value={filters.company}
            onChange={(e) => setFilters({...filters, company: e.target.value})}
            className="p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        {(filters.department || filters.location || filters.company) && (
          <button
            onClick={clearFilters}
            className="mt-3 text-sm text-blue-600 hover:text-blue-800"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map(job => (
            <JobCard key={job.id} job={job} onApplyNow={onApplyNow} />
          ))
        ) : (
          <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
            No jobs found matching your filters. Try adjusting your search criteria.
          </div>
        )}
      </div>
    </div>
  );

}