import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ManageApplicants() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState({
    name: "",
    email: "",
    message: "",
    questionsTitle: "",
    questions: [], // [{ q, options }]
  });

  const [selectedAppId, setSelectedAppId] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

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

  // ✅ Build preview questions from DB job.mcqs
  const buildPreviewFromJob = (job) => {
    const mcqs = Array.isArray(job?.mcqs) ? job.mcqs : [];
    if (mcqs.length === 3) {
      return {
        title: `${job.title} (3 MCQ)`,
        questions: mcqs.map((m) => ({
          q: m.question,
          options: m.options,
        })),
      };
    }
    // If admin did not save mcqs yet
    return {
      title: `${job?.title || "Interview"} (No MCQ saved)`,
      questions: [],
    };
  };

  // Open popup (shows REAL DB mcqs now)
  const handleSendInterview = (id) => {
    const app = applications.find((x) => x._id === id);
    if (!app) return;

    const job = app.jobId || {};
    const preview = buildPreviewFromJob(job);

    setSelectedAppId(app._id);
    setPopupData({
      name: app.userId?.name || "Applicant",
      email: app.userId?.email || "",
      message: "You are accepted for this position. Here are the interview questions.",
      questionsTitle: preview.title,
      questions: preview.questions,
    });

    setSent(false);
    setIsSending(false);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedAppId(null);
    setIsSending(false);
    setSent(false);
  };

 
  const handleSendNow = async () => {
    if (!selectedAppId) return;

    try {
      setIsSending(true);

      await axios.post(
        `${API_BASE}/api/admin/applications/${selectedAppId}/send-interview`,
        {}, 
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      setSent(true);
    } catch (e) {
      console.error("SEND INTERVIEW ERROR:", e);
      alert(e?.response?.data?.message || "Failed to send interview questions");
      setSent(false);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
          Manage Applicants
        </h3>

        <button
          onClick={loadApplications}
          className="w-full sm:w-auto rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="min-w-[900px] w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applicant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">View CV</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Interview</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
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
                    <td className="px-6 py-4 text-sm text-gray-900">{app.userId?.name || "-"}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{app.userId?.email || "-"}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{app.jobId?.title || "-"}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{app.jobId?.company || "-"}</td>

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
                        className="text-blue-600 hover:underline disabled:opacity-40"
                        disabled={app.status !== "Approved"}
                        title={app.status !== "Approved" ? "Approve first" : "Send interview questions"}
                        onClick={() => handleSendInterview(app._id)}
                      >
                        Send Interview
                      </button>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {app.status === "Pending" ? (
                          <>
                            <button className="text-green-600 hover:underline" onClick={() => handleStatusChange(app._id, "Approved")}>
                              Approve
                            </button>
                            <button className="text-red-600 hover:underline" onClick={() => handleStatusChange(app._id, "Rejected")}>
                              Reject
                            </button>
                          </>
                        ) : (
                          <button className="text-blue-600 hover:underline" onClick={() => handleStatusChange(app._id, "Pending")}>
                            Pending
                          </button>
                        )}

                        <button className="text-red-600 hover:underline" onClick={() => handleDeleteApplication(app._id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closePopup}></div>

          <div className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl bg-white shadow-xl flex flex-col overflow-hidden">
            <div className="flex items-start justify-between border-b p-4 sm:p-5">
              <div className="min-w-0">
                <h4 className="text-base sm:text-lg font-semibold text-gray-900">Interview Questions Ready</h4>
                <p className="text-sm text-gray-600 truncate">
                  For <span className="font-medium">{popupData.name}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1 truncate">Email: {popupData.email}</p>
              </div>

             
            </div>

            <div className="p-4 sm:p-5 space-y-4 overflow-y-auto">
              <div className="rounded-xl bg-green-50 border border-green-200 p-4">
                <p className="text-sm text-green-800">{popupData.message}</p>
              </div>

              <div className="rounded-xl border p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-gray-800">{popupData.questionsTitle}</p>
                  {sent && <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">Sent</span>}
                </div>

                {popupData.questions.length === 0 ? (
                  <div className="text-sm text-gray-600 bg-gray-50 border rounded-lg p-3">
                    No MCQ saved for this job yet. Please add MCQ from <b>Manage Jobs</b>.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {popupData.questions.map((item, idx) => (
                      <div key={idx} className="rounded-lg bg-gray-50 p-3 sm:p-4">
                        <p className="text-sm sm:text-base font-medium text-gray-900">
                          {idx + 1}. {item.q}
                        </p>
                        <div className="mt-2 grid gap-1">
                          {item.options.map((op, i) => (
                            <p key={i} className="text-sm text-gray-700">
                              {String.fromCharCode(65 + i)}. {op}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="border-t p-4 sm:p-5 bg-white">
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
                <button onClick={closePopup} className="w-full sm:w-auto rounded-xl border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Close
                </button>

                <button
                  onClick={handleSendNow}
                  disabled={isSending || sent}
                  className={`w-full sm:w-auto rounded-xl px-4 py-2 text-sm font-medium text-white ${
                    sent
                      ? "bg-green-600 opacity-70 cursor-not-allowed"
                      : isSending
                      ? "bg-blue-600 opacity-70 cursor-wait"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {sent ? "Sent" : isSending ? "Sending..." : "Send"}
                </button>
              </div>

              <p className="mt-3 text-xs text-gray-500">
                This preview shows saved job-wise MCQs from DB.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
