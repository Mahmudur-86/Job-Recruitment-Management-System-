import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);

  // Load users
  const loadUsers = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/users`
      );
      setUsers(data.users);
    } catch (err) {
      console.log("LOAD USERS ERROR:", err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Update status (Active/Blocked)
  const changeStatus = async (id, newStatus) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/user/status`, {
        userId: id,
        status: newStatus,
      });
      loadUsers();
    } catch (err) {
      console.log("STATUS UPDATE ERROR:", err);
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/user/${id}`);
      loadUsers();
    } catch (err) {
      console.log("DELETE ERROR:", err);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h3 className="text-xl font-semibold mb-6 text-gray-800 ">Manage Users</h3>
      <p className="text-gray-600 mb-6">Admin can view Users Name,E-mail, Role,Change Status or Delete Users.</p>

      <div className="bg-white rounded-lg shadow overflow-hidden ">
        <table className="w-full border-2">
          <thead className="bg-gray-50">
            <tr className="border-b-2">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase border-r-2 ">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase border-r-2 ">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase border-r-2 ">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase border-r-2 ">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase border-r-2 ">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {users.map((u) => (
              <tr key={u._id}>
                <td className="px-6 py-4 text-sm text-gray-800 border-2">{u.name}</td>
                <td className="px-6 py-4 text-sm text-gray-700 border-2">{u.email}</td>

                {/* ROLE (read only) */}
                <td className="px-6 py-4 text-sm text-gray-700 border-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                    {u.role}
                  </span>
                </td>

                {/* STATUS DROPDOWN */}
                <td className="px-6 py-4 text-sm text-gray-700 border-2">
                  <select
                    value={u.status}
                    onChange={(e) => changeStatus(u._id, e.target.value)}
                    className="px-2 py-1 border rounded"
                  >
                    <option value="Active">Active</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </td>

                {/* DELETE BUTTON */}
                <td className="px-6 py-4 text-sm text-gray-700 border-2">
                  <button
                    onClick={() => deleteUser(u._id)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td className="px-6 py-6 text-center text-gray-500" colSpan="5">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
