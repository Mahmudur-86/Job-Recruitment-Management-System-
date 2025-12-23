import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function JobCard({ job, profile }) {
  const [showRequestBox, setShowRequestBox] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // none | Pending | Approved | Rejected
  const [requestStatus, setRequestStatus] = useState("none");

  //  store my application id for this job 
  const [myAppId, setMyAppId] = useState(null);

  //  Success modal
  const [successModal, setSuccessModal] = useState(false);

  //  Toast popup state
  const [toast, setToast] = useState({ open: false, type: "info", message: "" });

  const token = useMemo(() => localStorage.getItem("token"), []);

  const jobDetails = {
    title: job?.title || "Job Title",
    company: job?.company || "Company Name",
    location: job?.location || "Location",
    category: job?.category || "Category",
    salary: job?.salary || "Negotiable",
    description: job?.description || "Job Description",
    requirements: job?.requirements || "Requirements",
    vacancies: job?.vacancies || "N/A",
  };

  const cvName =
    profile?.cvName || (profile?.cvUrl ? profile.cvUrl.split("/").pop() : "");

  const cvLink =
    profile?.cvUrl && profile.cvUrl.startsWith("http")
      ? profile.cvUrl
      : profile?.cvUrl
      ? `${API_BASE}${profile.cvUrl}`
      : "";

  const showToast = (type, message) => {
    setToast({ open: true, type, message });
    setTimeout(() => setToast((t) => ({ ...t, open: false })), 2200);
  };

  const badgeClass = (status) => {
    if (status === "Pending") return "bg-yellow-100 text-yellow-700";
    if (status === "Approved") return "bg-green-100 text-green-700";
    if (status === "Rejected") return "bg-red-100 text-red-700";
    return "";
  };

  //  JOB INTEREST MATCH RULE

  const normalize = (s) =>
    String(s || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const interestRaw = profile?.jobInterest || "";
  const interest = normalize(interestRaw);
  const titleText = normalize(jobDetails.title);
  const reqText = normalize(jobDetails.requirements);

  //  strict: interest must exist AND must match job
  const isInterestMatched =
    !!interest && (titleText.includes(interest) || reqText.includes(interest));

  // Load my applications → set status + myAppId for this job
  useEffect(() => {
    const loadMyStatus = async () => {
      try {
        if (!token || !job?._id) return;

        const { data } = await axios.get(`${API_BASE}/api/applications/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const found = (data.applications || []).find(
          (a) => a?.jobId?._id === job._id
        );

        setRequestStatus(found?.status || "none");
        setMyAppId(found?._id || null);
      } catch {
        // ignore
      }
    };

    loadMyStatus();
  }, [token, job?._id]);

  const handleToggle = () => setShowRequestBox((p) => !p);

  const closeSuccessModal = () => setSuccessModal(false);

  const handleSubmitJobRequest = async () => {
    if (!token) return showToast("error", "Please login first.");
    if (!profile?.cvUrl)
      return showToast("error", "Upload your CV in Profile first.");

    if (!profile?.jobInterest) {
      return showToast("error", "Set your Job Interest in Profile first.");
    }

    if (!isInterestMatched) {
      return showToast(
        "error",
        `This job doesn't match your interest (${profile.jobInterest}).`
      );
    }

    try {
      setIsSubmitting(true);

      //  create application
      const { data } = await axios.post(
        `${API_BASE}/api/applications`,
        { jobId: job._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRequestStatus("Pending");
      setMyAppId(data?.application?._id || null);

      setShowRequestBox(false);
      setSuccessModal(true);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        (err?.response?.status === 409
          ? "You already applied for this job."
          : "Failed to apply.");

      showToast("error", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  
  const handleRemoveJobRequest = async () => {
    if (!token) return showToast("error", "Please login first.");
    if (!myAppId) return showToast("error", "Application not found.");

    try {
      setIsSubmitting(true);

      await axios.delete(`${API_BASE}/api/applications/${myAppId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRequestStatus("none");
      setMyAppId(null);
      setShowRequestBox(false);

      showToast("info", "Job request removed.");
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to remove request.";
      showToast("error", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSendDisabled =
    isSubmitting ||
    !profile?.cvUrl ||
    requestStatus !== "none" ||
    !profile?.jobInterest ||
    !isInterestMatched;

  return (
    <div className="relative bg-white p-6 rounded-lg shadow-lg w-full">
      {/*  Toast */}
      {toast.open && (
        <div className="absolute top-3 right-3 z-50">
          <div
            className={`px-4 py-3 rounded-lg shadow-lg text-sm font-medium border
              ${
                toast.type === "success"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : toast.type === "error"
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-blue-50 text-blue-700 border-blue-200"
              }`}
          >
            {toast.message}
          </div>
        </div>
      )}

      {/* SUCCESS MODAL POPUP */}
      {successModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeSuccessModal}
          />

          <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl">
            <div className="flex items-start justify-between border-b p-5">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">
                  Job Request Sent 
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  Please wait for admin approval.
                </p>
              </div>

              <button
                onClick={closeSuccessModal}
                className="rounded-lg px-3 py-1 text-gray-600 hover:bg-gray-100"
              >
                
              </button>
            </div>

            <div className="p-5 space-y-3">
              <div className="rounded-xl bg-green-50 border border-green-200 p-4">
                <p className="text-sm text-green-800">
                  Your application for <b>{jobDetails.title}</b> at{" "}
                  <b>{jobDetails.company}</b> has been submitted successfully.
                </p>
              </div>

              <div className="text-sm text-gray-700">
                <p>
                  Status:{" "}
                  <span className="font-semibold text-yellow-700">Pending</span>
                </p>
                <p className="mt-1">
                  CV Submitted:{" "}
                  <span className="font-semibold">{cvName || "Your CV"}</span>
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t p-5">
              <button
                onClick={closeSuccessModal}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UI */}
      <h2 className="text-2xl font-semibold mb-4">{jobDetails.title}</h2>
      <p className="text-lg mb-6">Company: {jobDetails.company}</p>

      <p className="text-sm mb-2">Location: {jobDetails.location}</p>
      <p className="text-sm mb-2">Category: {jobDetails.category}</p>
      <p className="text-sm mb-2">Salary: {jobDetails.salary}</p>
      <p className="text-sm mb-2">Description: {jobDetails.description}</p>
      <p className="text-sm mb-4">Requirements: {jobDetails.requirements}</p>
      <p className="text-sm mb-4">Vacancies: {jobDetails.vacancies}</p>

      {/*  Show Interest */}
      {/* <p className="text-sm mb-3">
        Your Interest: <b>{profile?.jobInterest || "Not set"}</b>
      </p>*/}

      {/*  Only show mismatch message AFTER clicking Job Request (when box opens) */}
      {showRequestBox && profile?.jobInterest && !isInterestMatched && (
        <p className="text-sm text-red-600 mb-3">
          This job doesn’t match your interest. You can’t apply here.
        </p>
      )}

      {requestStatus !== "none" && (
        <div className="mb-3">
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${badgeClass(
              requestStatus
            )}`}
          >
            {requestStatus}
          </span>
        </div>
      )}

      <button
        onClick={handleToggle}
        className="bg-blue-600 text-white py-2 px-4 rounded-full"
      >
        Job Request
      </button>

      {showRequestBox && (
        <div className="mt-6 border-t pt-4">
          {profile?.cvUrl ? (
            <div className="mb-4">
              <p className="text-sm text-green-700">
                CV : <b>{cvName}</b>
              </p>

              <a
                href={cvLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-sm text-blue-600 underline"
              >
                Preview CV
              </a>
            </div>
          ) : (
            <p className="text-sm text-red-600 mb-4">
              No CV found. Upload CV first.
            </p>
          )}

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={handleSubmitJobRequest}
              disabled={isSendDisabled}
              className="bg-green-600 text-white py-2 px-6 rounded-full disabled:opacity-60"
            >
              {isSubmitting ? "Sending..." : "Send Job Request"}
            </button>

            {requestStatus === "Pending" && (
              <button
                onClick={handleRemoveJobRequest}
                disabled={isSubmitting}
                className="bg-red-600 text-white py-2 px-6 rounded-full hover:bg-red-700 disabled:opacity-60"
              >
                {isSubmitting ? "Removing..." : "Remove Job Request"}
              </button>
            )}

            <button
              onClick={() => setShowRequestBox(false)}
              disabled={isSubmitting}
              className="bg-gray-500 text-white py-2 px-6 rounded-full hover:bg-gray-600 disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
