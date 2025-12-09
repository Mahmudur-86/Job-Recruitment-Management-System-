import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JobCard from './JobCard';

export default function BrowseJobsTab({ onApplyNow }) {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // Fetch jobs from the backend
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/jobs');
        setJobs(response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div>
      
      <div>
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <JobCard key={job._id} job={job} onApplyNow={onApplyNow} />
          ))
        ) : (
          <p>No jobs available.</p>
        )}
      </div>
    </div>
  );
}
