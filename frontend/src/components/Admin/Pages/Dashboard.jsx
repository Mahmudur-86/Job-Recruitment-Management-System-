import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    employers: 0,
    totalJobs: 0,
    totalApplications: 0,
    totalInternshipAlert: 0,
  });

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/admin/stats`)
      .then((res) => setStats(res.data))
      .catch((err) => console.log(err));
  }, []);

  const cards = [
    { label: "Total Users", value: stats.totalUsers },
    
    { label: "Total Jobs", value: stats.totalJobs },
    { label: "Total Applications", value: stats.totalApplications },
 { label: "Total Internship Alerts", value: stats.totalInternshipAlert  },





  ];

  return (
    <div>
      <h3 className="text-xl font-semibold mb-6 text-gray-800">Dashboard Overview</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, idx) => (
          <div key={idx} className="bg-white shadow rounded-lg p-6">
            <p className="text-gray-600 text-sm">{c.label}</p>
            <p className="text-3xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
