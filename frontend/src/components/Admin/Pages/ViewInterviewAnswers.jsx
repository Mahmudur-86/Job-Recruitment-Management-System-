import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import EmailModal from "./EmailModal";
import InterviewModal from "./InterviewModal";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ViewInterviewAnswers() {
  const token = useMemo(() => localStorage.getItem("adminToken"), []);

  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);

  const fixCvLink = (cvUrl) => {
    if (!cvUrl) return "";
    if (cvUrl.startsWith("http")) return cvUrl;
    return `${API_BASE}${cvUrl}`;
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_BASE}/api/interviews/admin/applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setApplications(res.data?.applications || []);
    } catch (e) {
      console.error("FETCH ADMIN APPLICATIONS ERROR:", e);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h2 className="text-2xl font-bold">View Interview Answers</h2>

            <button
              onClick={fetchApplications}
              className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50"
            >
              Refresh
            </button>
          </div>

          <div className="space-y-4 mt-6">
            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : applications.length === 0 ? (
              <p className="text-gray-600">No Interview Answers found.</p>
            ) : (
              applications.map((app) => {
                const name = app?.userId?.name || "Applicant";
                const email = app?.userId?.email || "";
                const jobTitle = app?.jobId?.title || "";
                const company = app?.jobId?.company || "";
                const appliedOn = app?.createdAt
                  ? new Date(app.createdAt).toLocaleString()
                  : "";
                const status = app?.status || "Pending";
                const cvUrl = app?.cvUrl || "";

                const hasSubmitted = !!app?.hasSubmitted;
                const submittedAt = app?.submittedAt
                  ? new Date(app.submittedAt).toLocaleString()
                  : null;

                return (
                  <div key={app._id} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-start gap-6 flex-wrap">
                      <div className="min-w-[260px]">
                        <h3 className="text-xl font-bold">{name}</h3>
                        {email && <p className="text-gray-700">{email}</p>}

                        <p className="text-sm text-gray-700 mt-2">
                          Applied for:{" "}
                          <span className="font-semibold">{jobTitle}</span>
                          {company ? ` at ${company}` : ""}
                        </p>

                        <p className="text-xs text-gray-600 mt-1">
                          Applied on: {appliedOn}
                        </p>

                        <p className="text-xs text-gray-700 mt-2">
                          Status: <span className="font-semibold">{status}</span>
                        </p>

                        <p className="text-xs text-gray-700 mt-2 break-all">
                          CV: {cvUrl || "Not provided"}
                        </p>

                        <p className="text-xs mt-2">
                          Interview:{" "}
                          {hasSubmitted ? (
                            <span className="font-semibold text-green-600">
                              Submitted {submittedAt ? `(${submittedAt})` : ""}
                            </span>
                          ) : (
                            <span className="font-semibold text-orange-600">
                              Not submitted yet
                            </span>
                          )}
                        </p>
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                          onClick={() => {
                            const link = fixCvLink(cvUrl);
                            if (link) window.open(link, "_blank");
                            else alert("No CV available.");
                          }}
                        >
                          View CV
                        </button>

                        <button
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                          onClick={() => {
                            // ✅ IMPORTANT FIX: jobId must be string ObjectId, not the populated object
                            setSelectedPerson({
                              name,
                              email,
                              applicationId: app._id,
                              jobId: app?.jobId?._id || app?.jobId, // <-- FIX
                            });
                            setShowEmailModal(true);
                          }}
                        >
                          Email
                        </button>

                        <button
                          className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700"
                          onClick={() => {
                            setSelectedPerson(app);
                            setShowInterviewModal(true);
                          }}
                        >
                          View Answers
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {showEmailModal && selectedPerson && (
        <EmailModal person={selectedPerson} onClose={() => setShowEmailModal(false)} />
      )}

      {showInterviewModal && selectedPerson && (
        <InterviewModal application={selectedPerson} onClose={() => setShowInterviewModal(false)} />
      )}
    </div>
  );
}
