import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ManageApplicants() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  //  Modal state (your popup)
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState({
    name: "",
    email: "",
    link: "",
    message: "",
  });
  const [copied, setCopied] = useState(false);

  const adminToken = localStorage.getItem("adminToken");

  const fixCvLink = (cvUrl) => {
    if (!cvUrl) return "";
    if (cvUrl.startsWith("http")) return cvUrl;
    return `${API_BASE}${cvUrl}`;
  };

  const loadApplications = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_BASE}/api/admin/applications`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setApplications(data.applications || []);
    } catch (err) {
      console.error("ADMIN GET APPLICATIONS ERROR:", err);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
    // eslint-disable-next-line
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(
        `${API_BASE}/api/admin/applications/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      setApplications((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: newStatus } : a))
      );
    } catch (err) {
      console.error("STATUS UPDATE ERROR:", err);
    }
  };

  const handleDeleteApplication = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/admin/applications/${id}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      setApplications((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error("DELETE APPLICATION ERROR:", err);
    }
  };

  //  For now popup only (Interview notification )
  const handleSendInterview = (id) => {
    const app = applications.find((x) => x._id === id);
    if (!app) return;

    const interviewLink = `${window.location.origin}/interview-questions/${id}`;

    setPopupData({
      name: app.userId?.name || "Applicant",
      email: app.userId?.email || "",
      link: interviewLink,
      message:
        "You are accepted for this position. Here is the link — click this link to see the Interview question.",
    });

    setCopied(false);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setCopied(false);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(popupData.link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Manage Applicants</h3>

        <button
          onClick={loadApplications}
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Applicant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Job
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                View CV
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Interview Questions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {loading && (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && applications.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-gray-500">
                  No applications found.
                </td>
              </tr>
            )}

            {!loading &&
              applications.map((app) => (
                <tr key={app._id}>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {app.userId?.name || "-"}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {app.userId?.email || "-"}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {app.jobId?.title || "-"}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {app.jobId?.company || "-"}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        app.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : app.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm">
                    <button
                      className="text-blue-600 hover:underline disabled:opacity-40"
                      disabled={!app.cvUrl}
                      onClick={() => window.open(fixCvLink(app.cvUrl), "_blank")}
                    >
                      View CV
                    </button>
                  </td>

                  <td className="px-6 py-4 text-sm">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => handleSendInterview(app._id)}
                    >
                      Send Interview Questions
                    </button>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {app.status === "Pending" ? (
                        <>
                          <button
                            className="text-green-600 hover:underline"
                            onClick={() => handleStatusChange(app._id, "Approved")}
                          >
                            Approve
                          </button>
                          <button
                            className="text-red-600 hover:underline"
                            onClick={() => handleStatusChange(app._id, "Rejected")}
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <button
                          className="text-blue-600 hover:underline"
                          onClick={() => handleStatusChange(app._id, "Pending")}
                        >
                          Pending
                        </button>
                      )}

                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => handleDeleteApplication(app._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/*  Modal Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50" onClick={closePopup}></div>

          <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl">
            <div className="flex items-start justify-between border-b p-5">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">
                  Interview Link Ready ✅
                </h4>
                <p className="text-sm text-gray-600">
                  For <span className="font-medium">{popupData.name}</span>
                </p>
              </div>

              <button
                onClick={closePopup}
                className="rounded-lg px-3 py-1 text-gray-600 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="rounded-xl bg-green-50 border border-green-200 p-4">
                <p className="text-sm text-green-800">{popupData.message}</p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase">
                  Interview Link
                </p>

                <div className="flex items-center gap-2">
                  <a
                    href={popupData.link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 truncate rounded-xl border px-3 py-2 text-sm text-blue-700 hover:underline"
                    title={popupData.link}
                  >
                    {popupData.link}
                  </a>

                  <button
                    onClick={copyLink}
                    className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>

                <p className="text-xs text-gray-500">
                  (Notification sending part will be added next.)
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t p-5">
              <button
                onClick={() => window.open(popupData.link, "_blank")}
                className="rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                Open Link
              </button>
              <button
                onClick={closePopup}
                className="rounded-xl border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
