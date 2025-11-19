import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const adminToken = localStorage.getItem("adminToken");

  // Load all users
  const loadUsers = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      setUsers(data.users);
    } catch (err) {
      console.log("LOAD USERS ERROR:", err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Open modal
  const openDeleteModal = (id) => {
    setUserToDelete(id);
    setShowConfirm(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/user/${userToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      setShowConfirm(false);
      setUserToDelete(null);
      loadUsers();
    } catch (err) {
      console.log("DELETE ERROR:", err);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowConfirm(false);
    setUserToDelete(null);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen relative">
      <h3 className="text-xl font-semibold mb-6 text-gray-800">
        Manage Users
      </h3>
      <p className="text-gray-600 mb-6">
        Change Status or Delete Users.
      </p>

      {/* Delete Confirmation Modal (floating box — no dark background) */}
      {showConfirm && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl border w-80">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Are you sure you want to delete this user?
            </h3>

            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                No
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full border-2">
          <thead className="bg-gray-50">
            <tr className="border-b-2">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase border-r-2">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase border-r-2">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase border-r-2">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase border-r-2">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase border-r-2">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {users.map((u) => (
              <tr key={u._id}>
                <td className="px-6 py-4 text-sm text-gray-800 border-2">
                  {u.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 border-2">
                  {u.email}
                </td>
                <td className="px-6 py-4 text-sm border-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                    {u.role}
                  </span>
                </td>

                <td className="px-6 py-4 text-sm border-2">
                  <select
                    value={u.status}
                    onChange={(e) =>
                      axios
                        .post(
                          `${import.meta.env.VITE_API_URL}/api/admin/user/status`,
                          {
                            userId: u._id,
                            status: e.target.value,
                          },
                          {
                            headers: {
                              Authorization: `Bearer ${adminToken}`,
                            },
                          }
                        )
                        .then(() => loadUsers())
                    }
                    className="px-2 py-1 border rounded"
                  >
                    <option value="Active">Active</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </td>

                <td className="px-6 py-4 text-sm border-2">
                  <button
                    onClick={() => openDeleteModal(u._id)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td
                  className="px-6 py-6 text-center text-gray-500"
                  colSpan="5"
                >
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
