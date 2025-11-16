import React from 'react';

export default function Dashboard() {
  const ee = [
    { label: 'Total Users', value: '3', color: 'bg-blue-500' },
    { label: 'Total Jobs', value: '2', color: 'bg-green-500' },
    { label: 'Employers', value: '1', color: 'bg-purple-500' },
    { label: 'Total Applications', value: '10', color: 'bg-orange-500' },
    { label: 'Internship Alerts', value: '1', color: 'bg-red-500' },
     { label: 'Internship Student List', value: '1', color: 'bg-red-500' },
  ];

  return (
    <div>
      <h3 className="text-xl font-semibold mb-6 text-gray-800">Dashboard Overview</h3>
      <p className="text-gray-600 mb-6">Overview of total users, jobs, employers, applications and internship alerts.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {ee.map((stat, idx) => (
          <div key={idx} className="bg-neutral-500 rounded-lg shadow p-6 flex flex-col justify-between">
            
              <span className="text-white text-sm font-semibold text-left px-2 leading-tight transition-[1,2] duration-500 hover:h-2 ">{stat.label}</span>
            
            <p className="text-2xl font-bold text-gray-800 text-right ">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
