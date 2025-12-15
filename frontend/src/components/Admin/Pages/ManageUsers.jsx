import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [statusToUpdate, setStatusToUpdate] = useState(null);
  const [status, setStatus] = useState("");
  const [showUpdate, setShowUpdate] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Details modal
  const [showDetails, setShowDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const adminToken = localStorage.getItem("adminToken");

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setStatusChange = (userId, statusValue) => {
    setStatusToUpdate(userId);
    setStatus(statusValue);
    setShowUpdate(userId);
  };

  const updateStatus = (userId) => {
    if (statusToUpdate === userId) {
      axios
        .post(
          `${import.meta.env.VITE_API_URL}/api/admin/user/status`,
          {
            userId,
            status,
          },
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
            },
          }
        )
        .then(() => {
          loadUsers();
          setShowUpdate(null);
          setShowDropdown(null);
        })
        .catch((err) => console.log(err));
    }
  };

  const toggleDropdown = (userId) => {
    setShowDropdown((prev) => (prev === userId ? null : userId));
  };

  const openDeleteModal = (id) => {
    setUserToDelete(id);
    setShowConfirm(true);
  };

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

  const cancelDelete = () => {
    setShowConfirm(false);
    setUserToDelete(null);
  };

  //  Fetch FULL_DETAILS API
  const fetchUserDetails = async (userId) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/user/${userId}/details`,
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );

      const { user, profile } = res.data;

      //  SAFE merge + normalize fields
      const merged = {
        ...user,
        ...(profile || {}),

        // Employer fields
        EmployerName: profile?.EmployerName || "",
        CompanyName: profile?.CompanyName || "",
        email: profile?.email || user?.email || "",
        phone: profile?.phone || user?.phone || "",
        address: profile?.address || user?.address || "",
        website: profile?.website || "",

        companyLogo: profile?.companyLogo
          ? `${import.meta.env.VITE_API_URL}/${profile.companyLogo}`
          : "",

        // Jobseeker fields
        profileImage: profile?.profileImageUrl
          ? `${import.meta.env.VITE_API_URL}${profile.profileImageUrl}`
          : "",
        cvUrl: profile?.cvUrl
          ? `${import.meta.env.VITE_API_URL}${profile.cvUrl}`
          : "",
      };

      setSelectedUser(merged);
      setShowDetails(true);
    } catch (err) {
      console.log("DETAILS FETCH ERROR:", err);
    }
  };

  const closeDetailsModal = () => {
    setSelectedUser(null);
    setShowDetails(false);
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen relative">
      <h3 className="text-xl font-semibold mb-2 text-gray-800">Manage Users</h3>
      <p className="text-gray-600 mb-6 text-sm">Change Status or Delete Users.</p>

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-40 flex items-start justify-center px-4 pt-24 bg-black/40">
          <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-200 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Are you sure you want to delete this user?
            </h3>

            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
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

      {/* DETAILS MODAL (EMPLOYER / JOBSEEKER) */}
      {showDetails && selectedUser && (
        <div className="fixed inset-0 z-40 flex items-start justify-center px-4 py-6 sm:py-8 bg-black/40 overflow-y-auto">
          
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl p-5 sm:p-8 relative border border-gray-200">
            {/* EMPLOYER VIEW */}
            {["employer", "Employer", "EMPLOYER"].includes(selectedUser.role) ? (
              <>
                <div className="flex justify-center mb-6">
                  {selectedUser.companyLogo ? (
                    <img
                      src={selectedUser.companyLogo}
                      alt="Company Logo"
                      className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36
                                 rounded-full border border-gray-200 bg-white shadow-md
                                 object-contain"
                    />
                  ) : (
                    <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm">
                      No Logo
                    </div>
                  )}
                </div>

                <h2 className="text-2xl font-bold text-center mb-6 sm:mb-8">
                  Company Profile
                </h2>

                <div className="space-y-3 text-sm sm:text-base">
                  <p>
                    <span className="font-semibold">Employer Name: </span>
                    {selectedUser.EmployerName || selectedUser.name || ""}
                  </p>

                  <p className="wrap-break-word">
                    <span className="font-semibold">Email: </span>
                    {selectedUser.email || ""}
                  </p>

                  <p>
                    <span className="font-semibold">Company Name: </span>
                    {selectedUser.CompanyName || ""}
                  </p>

                  <p>
                    <span className="font-semibold">Address: </span>
                    {selectedUser.address || ""}
                  </p>

                  <p>
                    <span className="font-semibold">Company Contact: </span>
                    {selectedUser.phone || ""}
                  </p>

                  <p className="wrap-break-word">
                    <span className="font-semibold">Website: </span>
                    {selectedUser.website ? (
                      <a
                        href={selectedUser.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline wrap-break-word"
                      >
                        {selectedUser.website}
                      </a>
                    ) : (
                      ""
                    )}
                  </p>
                </div>
              </>
            ) : (
              <>
                {/* JOBSEEKER VIEW */}
                <div className="flex justify-center mb-6">
                  <img
                    src={selectedUser.profileImage}
                    alt=""
                    className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36
                               rounded-full border border-gray-200 bg-white shadow-md
                               object-contain object-top"
                  />
                </div>

                <h2 className="text-xl font-semibold mb-6">Profile Details</h2>

                <div className="space-y-2 text-sm sm:text-base">
                  <p>
                    <span className="font-semibold">Name: </span>
                    {selectedUser.name}
                  </p>
                  <p className="wrap-break-word">
                    <span className="font-semibold">Email: </span>
                    {selectedUser.email}
                  </p>
                  <p>
                    <span className="font-semibold">Phone: </span>
                    {selectedUser.phone}
                  </p>
                  <p className="wrap-break-word">
                    <span className="font-semibold">Address: </span>
                    {selectedUser.address}
                  </p>
                  <p>
                    <span className="font-semibold">Age: </span>
                    {selectedUser.age}
                  </p>
                  <p>
                    <span className="font-semibold">Gender: </span>
                    {selectedUser.gender}
                  </p>
                  <p>
                    <span className="font-semibold">Job Interest: </span>
                    {selectedUser.jobInterest}
                  </p>
                  <p className="wrap-break-word">
                    <span className="font-semibold">Bio: </span>
                    {selectedUser.bio}
                  </p>

                  <p className="wrap-break-word">
                    <span className="font-semibold">Portfolio: </span>
                    {selectedUser.portfolio && (
                      <a
                        href={selectedUser.portfolio}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline wrap-break-word"
                      >
                        {selectedUser.portfolio}
                      </a>
                    )}
                  </p>

                  <p className="wrap-break-word">
                    <span className="font-semibold">GitHub: </span>
                    {selectedUser.github && (
                      <a
                        href={selectedUser.github}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline wrap-break-word"
                      >
                        {selectedUser.github}
                      </a>
                    )}
                  </p>

                  <p className="wrap-break-word">
                    <span className="font-semibold">LinkedIn: </span>
                    {selectedUser.linkedin && (
                      <a
                        href={selectedUser.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline wrap-break-word"
                      >
                        {selectedUser.linkedin}
                      </a>
                    )}
                  </p>

                  <p>
                    <span className="font-semibold">CV: </span>
                    {selectedUser.cvUrl && (
                      <a
                        href={selectedUser.cvUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline"
                      >
                        View CV
                      </a>
                    )}
                  </p>
                </div>
              </>
            )}

            <div className="mt-8 flex justify-end">
              <button
                onClick={closeDetailsModal}
                className="px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* USERS TABLE */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="min-w-[900px] w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
                  Name
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
                  Email
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
                  Role
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
                  Details
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                    {u.name}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-700 wrap-break-word">
                    {u.email}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm whitespace-nowrap">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                      {u.role}
                    </span>
                  </td>

                  <td className="px-4 sm:px-6 py-4 text-sm">
                    <div className="relative inline-block">
                      <button
                        onClick={() => toggleDropdown(u._id)}
                        className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium transition-shadow whitespace-nowrap"
                      >
                        View
                      </button>

                      {showDropdown === u._id && (
                        <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-2xl z-50 overflow-hidden">
                          <select
                            value={statusToUpdate === u._id ? status : u.status}
                            onChange={(e) =>
                              setStatusChange(u._id, e.target.value)
                            }
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

                  <td className="px-4 sm:px-6 py-4 text-sm whitespace-nowrap">
                    <button
                      onClick={() => fetchUserDetails(u._id)}
                      className="px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 whitespace-nowrap"
                    >
                      View Details
                    </button>
                  </td>

                  <td className="px-4 sm:px-6 py-4 text-sm whitespace-nowrap">
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
                  <td className="px-6 py-6 text-center text-gray-500" colSpan="6">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-2 sm:hidden">
        Tip: Swipe left/right to see the full table.
      </p>
    </div>
  );
}
