import React, { useState } from "react";
import EmailModal from "./EmailModal";
import InterviewModal from "./InterviewModal";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ViewApplications({
  setCurrentPage,
  applications = [],
  refreshApplications, // optional (passed from EmployerDashboard)
  showEmailModal,
  setShowEmailModal,
  selectedPerson,
  setSelectedPerson,
}) {
  const [showInterviewModal, setShowInterviewModal] = useState(false);

  const fixCvLink = (cvUrl) => {
    if (!cvUrl) return "";
    if (cvUrl.startsWith("http")) return cvUrl;
    return `${API_BASE}${cvUrl}`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-8">
        <button
          onClick={() => setCurrentPage("dashboard")}
          className="mb-4 text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </button>

        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h2 className="text-2xl font-bold">Applications</h2>

            {typeof refreshApplications === "function" && (
           <button
                onClick={refreshApplications}
                className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50"
              >
                Refresh
              </button> 
            )}
          </div>

          <div className="space-y-4 mt-6">
            {applications.length === 0 ? (
              <p className="text-gray-600">No applications found.</p>
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

                return (
                  <div
                    key={app._id}
                    className="bg-white p-6 rounded-lg shadow-md"
                  >
                    <div className="flex justify-between items-start gap-6 flex-wrap">
                      {/* LEFT INFO */}
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
                          Status:{" "}
                          <span className="font-semibold">{status}</span>
                        </p>

                        <p className="text-xs text-gray-700 mt-2 break-all">
                          CV: {cvUrl || "Not provided"}
                        </p>
                      </div>

                      {/* RIGHT BUTTONS */}
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
                            // Email later, but modal can open
                            setSelectedPerson({ name, email });
                            setShowEmailModal(true);
                          }}
                        >
                          Email
                        </button>

                        <button
                          className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700"
                          onClick={() => {
                            // Pass full application to InterviewModal
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

      {/* EMAIL MODAL */}
      {showEmailModal && selectedPerson && (
        <EmailModal
          person={selectedPerson}
          onClose={() => setShowEmailModal(false)}
        />
      )}

      {/* INTERVIEW ANSWERS MODAL */}
      {showInterviewModal && selectedPerson && (
        <InterviewModal
          application={selectedPerson}
          onClose={() => setShowInterviewModal(false)}
        />
      )}
    </div>
  );
}
