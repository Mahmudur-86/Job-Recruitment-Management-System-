import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalApplications: 0,
   
  });
  useEffect(() => {
    const loadStats = async () => {
      try {
        const adminToken = localStorage.getItem("adminToken");
        const { data } = await axios.get(`${API_BASE}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        setStats(data);
      } catch (err) {
        console.log("DASHBOARD STATS ERROR:", err);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/*  Page wrapper (responsive padding, nice header) */}
      <div className="p-4 sm:p-6 lg:p-8 fade-in">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        </div>

        {/*  Stats grid (same data, better UI) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Total Users */}
          <div className="bg-white shadow-sm p-6 rounded-2xl border card pop-in">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-600">Total Jobseekers</h3>
                <p className="text-3xl font-semibold text-blue-600 mt-2">{stats.totalUsers}</p>
              </div>
            </div>
          </div>
          {/* Total Jobs */}
          <div className="bg-white shadow-sm p-6 rounded-2xl border card pop-in">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-600">Total Jobs</h3>
                <p className="text-3xl font-semibold text-blue-600 mt-2">{stats.totalJobs}</p>
              </div>
            </div>
            <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            </div>
          </div>
          {/* Applicants */}
          <div className="bg-white shadow-sm p-6 rounded-2xl border card pop-in">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-600">Applicants</h3>
                <p className="text-3xl font-semibold text-blue-800 mt-2">
                  {stats.totalApplications}
                </p>
              </div>
            </div>
            <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
