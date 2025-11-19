import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    employers: 0,
    totalJobs: 0,
    totalApplications: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const adminToken = localStorage.getItem("adminToken");

        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/stats`,
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
            },
          }
        );

        setStats(data);
      } catch (err) {
        console.log("DASHBOARD STATS ERROR:", err);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Admin Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Total Users */}
        <div className="bg-white shadow p-6 rounded-lg border">
          <h3 className="text-xl font-bold text-gray-700 mb-2">Total Users</h3>
          <p className="text-3xl font-semibold text-blue-600">{stats.totalUsers}</p>
        </div>

        {/* Employers */}
        <div className="bg-white shadow p-6 rounded-lg border">
          <h3 className="text-xl font-bold text-gray-700 mb-2">Employers</h3>
          <p className="text-3xl font-semibold text-green-600">{stats.employers}</p>
        </div>

        {/* Total Jobs */}
        <div className="bg-white shadow p-6 rounded-lg border">
          <h3 className="text-xl font-bold text-gray-700 mb-2">Total Jobs</h3>
          <p className="text-3xl font-semibold text-purple-600">{stats.totalJobs}</p>
        </div>

        {/* Total Applications */}
        <div className="bg-white shadow p-6 rounded-lg border">
          <h3 className="text-xl font-bold text-gray-700 mb-2">Applications</h3>
          <p className="text-3xl font-semibold text-green-800">{stats.totalApplications}</p>
        </div>

      </div>
    </div>
  );
}
