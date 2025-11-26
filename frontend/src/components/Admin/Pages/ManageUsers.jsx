import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [statusToUpdate, setStatusToUpdate] = useState(null); // Track the user being updated
  const [status, setStatus] = useState(""); // Store the status for that specific user
  const [showUpdate, setShowUpdate] = useState(null); // Show the "Update" button per user
  const [showDropdown, setShowDropdown] = useState(null); // Track which user's dropdown is open
  const [showConfirm, setShowConfirm] = useState(false); // For the delete confirmation modal
  const [userToDelete, setUserToDelete] = useState(null); // For the user to delete

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

  // Handle status change for specific user
  const setStatusChange = (userId, statusValue) => {
    setStatusToUpdate(userId);
    setStatus(statusValue);
    setShowUpdate(userId); // Show the Update button for the selected user
  };

  // Update user status
  const updateStatus = (userId) => {
    if (statusToUpdate === userId) {
      axios
        .post(
          `${import.meta.env.VITE_API_URL}/api/admin/user/status`,
          {
            userId: userId,
            status: status,
          },
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
            },
          }
        )
        .then(() => {
          loadUsers();
          setShowUpdate(null); // Hide the Update button after update
          setShowDropdown(null); // Close the dropdown after update
        })
        .catch((err) => console.log(err));
    }
  };

  // Toggle the dropdown for status change
  const toggleDropdown = (userId) => {
    if (showDropdown === userId) {
      setShowDropdown(null); // Close the dropdown if already open
    } else {
      setShowDropdown(userId); // Open the dropdown for the specific user
    }
  };

  // Open the delete confirmation modal
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
      <h3 className="text-xl font-semibold mb-6 text-gray-800">Manage Users</h3>
      <p className="text-gray-600 mb-6">Change Status or Delete Users.</p>

      {/* Delete Confirmation Modal */}
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
      <div className="bg-white rounded-lg shadow ">
        <table className="w-full  border-2">
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
                  <div className="relative inline-block">
                    {/* View Button (No Eye Icon) */}
                    <button
                      onClick={() => toggleDropdown(u._id)}
                      className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium transition-shadow "
                    >
                      View
                    </button>

                    {/* Dropdown for Active/Blocked */}
                    {showDropdown === u._id && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-2xl z-50 overflow-hidden">
                        <select
                          value={statusToUpdate === u._id ? status : u.status}
                          onChange={(e) => setStatusChange(u._id, e.target.value)}
                          className="w-full px-4 py-3 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none cursor-pointer border-b border-gray-200"
                        >
                          <option value="Active">Active</option>
                          <option value="Blocked">Blocked</option>
                        </select>

                        {showUpdate === u._id && (
                          <button
                            onClick={() => updateStatus(u._id)}
                            className="w-full px-4 py-3 bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors"
                          >
                            Update
                          </button>
                        )}
                      </div>
                    )}
                  </div>
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
