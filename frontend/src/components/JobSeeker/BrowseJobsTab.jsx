import React, { useEffect, useState } from "react";
import axios from "axios";
import JobCard from "./JobCard";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function BrowseJobsTab({ profile }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/jobs`);
        setJobs(res.data || []);
      } catch (err) {
        console.error("Failed to load jobs:", err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <p className="text-gray-600 font-medium">Loading jobs...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 rounded-lg p-4">
      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} profile={profile} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg p-6 text-center shadow">
          <p className="text-gray-600 font-medium">No jobs available.</p>
        </div>
      )}
    </div>
  );
}
