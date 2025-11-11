import React from 'react';

export default function ManageUsers() {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', type: 'Job Seeker', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', type: 'Employer', status: 'Active' },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', type: 'Job Seeker', status: 'Blocked' }
  ];

  return (
    <div>
      <h3 className="text-xl font-semibold mb-6 text-gray-800">Manage Users</h3>
      <p className="text-gray-600 mb-6">Admin can approve, block or delete job seeker and employer accounts.</p>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 text-sm text-gray-900">{user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.type}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{user.status}</span>
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button className="text-blue-600 hover:text-blue-800">Approve</button>
                  <button className="text-yellow-600 hover:text-yellow-800">Block</button>
                  <button className="text-red-600 hover:text-red-800">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
