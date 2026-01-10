import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import AddJobModal from "./AddJobModal";
import AddInterviewQuestionModal from "./AddInterviewQuestionModal";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ManageJobs() {
  const adminToken = useMemo(() => localStorage.getItem("adminToken"), []);

  // DB jobs
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_BASE}/api/admin/jobs`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setJobs(data.jobs || []);
    } catch (e) {
      console.error("ADMIN LOAD JOBS ERROR:", e);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
    // eslint-disable-next-line
  }, []);

  // View interview modal
  const [open, setOpen] = useState(false);
  const [activeJob, setActiveJob] = useState(null);

  //  show correct answers toggle (only inside view modal)
  const [showCorrect, setShowCorrect] = useState(false);

  const openModal = (job) => {
    setActiveJob(job);
    setShowCorrect(false); 
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setActiveJob(null);
    setShowCorrect(false);
  };

  const handleDelete = async (jobId) => {
    try {
      await axios.delete(`${API_BASE}/api/admin/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
      if (activeJob?._id === jobId) closeModal();
    } catch (e) {
      console.error("DELETE JOB ERROR:", e);
      alert(e?.response?.data?.message || "Failed to delete job");
    }
  };

  // Add Job modal
  const [addOpen, setAddOpen] = useState(false);
  const emptyJobOnly = {
    jobTitle: "",
    company: "",
    location: "",
    category: "",
    salary: "",
    description: "",
    requirements: "",
    vacancies: "",
  };
  const [newJob, setNewJob] = useState(emptyJobOnly);
  const [addError, setAddError] = useState("");

  const updateJobField = (field, value) => {
    setNewJob((prev) => ({ ...prev, [field]: value }));
  };

  const validateAddJob = () => {
    const required = [
      "jobTitle",
      "company",
      "location",
      "category",
      "salary",
      "description",
      "requirements",
      "vacancies",
    ];
    for (const f of required) {
      if (!String(newJob[f] ?? "").trim()) return `${f} is required`;
    }
    return "";
  };

  const handleCreateJob = async () => {
    const err = validateAddJob();
    if (err) return setAddError(err);

    try {
      const payload = {
        title: newJob.jobTitle, 
        company: newJob.company,
        location: newJob.location,
        category: newJob.category,
        salary: newJob.salary,
        description: newJob.description,
        requirements: newJob.requirements,
        vacancies: newJob.vacancies,
      };

      const { data } = await axios.post(`${API_BASE}/api/admin/jobs`, payload, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      if (data?.job) setJobs((prev) => [data.job, ...prev]);

      setAddError("");
      setNewJob(emptyJobOnly);
      setAddOpen(false);
    } catch (e) {
      console.error("CREATE JOB ERROR:", e);
      setAddError(e?.response?.data?.message || "Failed to create job");
    }
  };

  const closeAddJobModal = () => {
    setAddOpen(false);
    setAddError("");
    setNewJob(emptyJobOnly);
  };

  // Add Interview Question modal
  const [iqOpen, setIqOpen] = useState(false);
  const [iqJobId, setIqJobId] = useState("");
  const [iqError, setIqError] = useState("");

  const emptyMcqs3 = [
    { question: "", options: ["", "", "", ""], correctOption: 0 },
    { question: "", options: ["", "", "", ""], correctOption: 0 },
    { question: "", options: ["", "", "", ""], correctOption: 0 },
  ];
  const [mcqForm, setMcqForm] = useState(emptyMcqs3);

  const openInterviewQuestionModal = (jobId) => {
    setIqJobId(jobId || "");
    setMcqForm(emptyMcqs3);
    setIqError("");
    setIqOpen(true);
  };

  const closeInterviewQuestionModal = () => {
    setIqOpen(false);
    setIqJobId("");
    setMcqForm(emptyMcqs3);
    setIqError("");
  };

  const updateMcqField = (index, field, value) => {
    setMcqForm((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const updateMcqOption = (qIndex, optIndex, value) => {
    setMcqForm((prev) => {
      const next = [...prev];
      const options = [...next[qIndex].options];
      options[optIndex] = value;
      next[qIndex] = { ...next[qIndex], options };
      return next;
    });
  };

  const validateMcqs = () => {
    for (let i = 0; i < 3; i++) {
      const q = mcqForm[i];
      if (!String(q.question).trim()) return `MCQ ${i + 1} question is required`;
      for (let j = 0; j < 4; j++) {
        if (!String(q.options[j]).trim())
          return `MCQ ${i + 1} option ${j + 1} is required`;
      }
      if (q.correctOption < 0 || q.correctOption > 3)
        return `MCQ ${i + 1} correct option invalid`;
    }
    return "";
  };

  const handleSaveInterviewQuestions = async () => {
    if (!iqJobId) return setIqError("Please select a job first");

    const err = validateMcqs();
    if (err) return setIqError(err);

    try {
      const built = mcqForm.map((m, idx) => ({
        question: m.question.startsWith(`${idx + 1}.`)
          ? m.question
          : `${idx + 1}. ${m.question}`,
        options: m.options,
        correctOption: Number(m.correctOption) || 0,
      }));

      const { data } = await axios.put(
        `${API_BASE}/api/admin/jobs/${iqJobId}/mcqs`,
        { mcqs: built },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      const updatedJob = data?.job;
      if (updatedJob) {
        setJobs((prev) => prev.map((j) => (j._id === updatedJob._id ? updatedJob : j)));
        if (activeJob?._id === updatedJob._id) setActiveJob(updatedJob);
      }

      closeInterviewQuestionModal();
    } catch (e) {
      console.error("SAVE MCQS ERROR:", e);
      setIqError(e?.response?.data?.message || "Failed to save interview questions");
    }
  };

  // show title as jobTitle
  const uiJobs = jobs.map((j) => ({ ...j, jobTitle: j.title }));

  // Edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editJobId, setEditJobId] = useState("");
  const [editError, setEditError] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  const [editJob, setEditJob] = useState({
    jobTitle: "",
    company: "",
    location: "",
    category: "",
    salary: "",
    description: "",
    requirements: "",
    vacancies: "",
  });

  const openEditModal = (job) => {
    setEditJobId(job?._id || "");
    setEditJob({
      jobTitle: job?.title || job?.jobTitle || "",
      company: job?.company || "",
      location: job?.location || "",
      category: job?.category || "",
      salary: job?.salary || "",
      description: job?.description || "",
      requirements: job?.requirements || "",
      vacancies: String(job?.vacancies ?? ""),
    });
    setEditError("");
    setEditOpen(true);
  };

  const closeEditModal = () => {
    setEditOpen(false);
    setEditJobId("");
    setEditError("");
    setEditSaving(false);
  };

  const updateEditField = (field, value) => {
    setEditJob((prev) => ({ ...prev, [field]: value }));
  };

  const validateEditJob = () => {
    const required = [
      "jobTitle",
      "company",
      "location",
      "category",
      "salary",
      "description",
      "requirements",
      "vacancies",
    ];
    for (const f of required) {
      if (!String(editJob[f] ?? "").trim()) return `${f} is required`;
    }
    return "";
  };

  const handleUpdateJob = async () => {
    if (!editJobId) return setEditError("Invalid job selected");

    const err = validateEditJob();
    if (err) return setEditError(err);

    try {
      setEditSaving(true);

      const payload = {
        title: editJob.jobTitle, 
        company: editJob.company,
        location: editJob.location,
        category: editJob.category,
        salary: editJob.salary,
        description: editJob.description,
        requirements: editJob.requirements,
        vacancies: editJob.vacancies,
      };

      const { data } = await axios.put(
        `${API_BASE}/api/admin/jobs/${editJobId}`,
        payload,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      const updatedJob = data?.job;
      if (updatedJob) {
        setJobs((prev) => prev.map((j) => (j._id === updatedJob._id ? updatedJob : j)));
        if (activeJob?._id === updatedJob._id) setActiveJob(updatedJob);
      } else {
        // fallback (if API returns updated fields only)
        setJobs((prev) =>
          prev.map((j) =>
            j._id === editJobId ? { ...j, ...payload, title: payload.title } : j
          )
        );
        if (activeJob?._id === editJobId) {
          setActiveJob((prev) =>
            prev ? { ...prev, ...payload, title: payload.title } : prev
          );
        }
      }

      closeEditModal();
    } catch (e) {
      console.error("UPDATE JOB ERROR:", e);
      setEditError(e?.response?.data?.message || "Failed to update job");
    } finally {
      setEditSaving(false);
    }
  };
  const [textOpen, setTextOpen] = useState(false);
  const [textTitle, setTextTitle] = useState("");
  const [textBody, setTextBody] = useState("");

  const openTextModal = (title, body) => {
    setTextTitle(title || "Details");
    setTextBody(body || "-");
    setTextOpen(true);
  };

  const closeTextModal = () => {
    setTextOpen(false);
    setTextTitle("");
    setTextBody("");
  };
  const renderCompactText = (label, value) => {
    const v = String(value ?? "").trim();
    const isLong = v.length > 140;

    return (
      <div className="space-y-1">
        <div className="text-[13px] text-gray-700 leading-5 wrap-break-word line-clamp-3">
          {v || "-"}
        </div>

        {isLong ? (
          <button
            type="button"
            onClick={() => openTextModal(label, v)}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
          >
            Read more
          </button>
        ) : null}
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Background + container */}
      <div className="min-h-[calc(100vh-90px)] bg-gray-50/60">
        <div className="mx-auto w-full max-w-[1400px] px-3 sm:px-5 lg:px-7 py-4 sm:py-6">
          {/* Header */}
          <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">
                Manage Jobs
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {loading ? "Loading..." : `Total: ${uiJobs.length}`}
              </p>
            </div>

            <button
              onClick={() => setAddOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 text-white shadow hover:bg-indigo-700 active:scale-[0.99] transition w-full sm:w-auto"
            >
              + Add Job
            </button>
          </div>
          {/* Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* top bar */}
            <div className="px-4 sm:px-6 py-3 border-b bg-white">
              <div className="flex items-center justify-between">
              </div>
            </div>
            {/* Table */}
            <div className="w-full overflow-x-auto">
              <table className="min-w-[1180px] w-full table-fixed">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    {[
                      { h: "Job Title", w: "w-[220px]" },
                      { h: "Company", w: "w-[140px]" },
                      { h: "Location", w: "w-[160px]" },
                      { h: "Category", w: "w-[120px]" },
                      { h: "Salary", w: "w-[120px]" },
                      { h: "Description", w: "w-[280px]" },
                      { h: "Requirements", w: "w-[280px]" },
                      { h: "Vacancies", w: "w-[90px]" },
                      { h: "Interview", w: "w-[230px]" },
                      { h: "Actions", w: "w-[160px]" },
                    ].map((col) => (
                      <th
                        key={col.h}
                        className={`px-4 py-3 text-left text-[11px] font-bold text-gray-600 uppercase tracking-wider ${col.w}`}
                      >
                        {col.h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={10} className="px-6 py-12">
                        <div className="flex items-center justify-center gap-3 text-gray-600">
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-800" />
                          <p className="text-sm">Loading jobs...</p>
                        </div>
                      </td>
                    </tr>
                  ) : uiJobs.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-6 py-12 text-center text-gray-600">
                        No jobs found. Click <b>+ Add Job</b> to create your first job.
                      </td>
                    </tr>
                  ) : (
                    uiJobs.map((job, idx) => (
                      <tr
                        key={job._id}
                        className={`align-top ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"} hover:bg-indigo-50/40 transition-colors`}
                      >
                        <td className="px-4 py-4">
                          <div className="font-semibold text-gray-900 leading-5">
                            {job.jobTitle}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-800">
                          {job.company || "-"}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-800">
                          {job.location || "-"}
                        </td>
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border">
                            {job.category || "-"}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-800">
                          {job.salary || "-"}
                        </td>
                        <td className="px-4 py-4">
                          {renderCompactText("Job Description", job.description)}
                        </td>
                        <td className="px-4 py-4">
                          {renderCompactText("Job Requirements", job.requirements)}
                        </td>
                        <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                          {job.vacancies}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => openModal(job)}
                              className="px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-sm font-medium transition"
                            >
                              See Interview Question
                            </button>
                            <button
                              onClick={() => openInterviewQuestionModal(job._id)}
                              className="px-3 py-2 rounded-lg border border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-sm font-semibold transition"
                            >
                              Add Interview Question
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => openEditModal(job)}
                              className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-sm font-medium transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(job._id)}
                              className="px-3 py-2 rounded-lg border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 text-sm font-semibold transition"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/*  Text Modal (Description/Requirements full view) */}
      {textOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center px-3 sm:px-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeTextModal} />
          <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border overflow-hidden">
            <div className="p-4 sm:p-5 border-b flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h4 className="text-lg font-semibold text-gray-900 truncate">{textTitle}</h4>
                <p className="text-sm text-gray-500 mt-0.5">Full details</p>
              </div>
              <button
                onClick={closeTextModal}
                className="px-3 py-2 rounded-lg border hover:bg-gray-50 text-sm"
              >
                Close
              </button>
            </div>
            <div className="p-4 sm:p-5 max-h-[70vh] overflow-y-auto">
              <div className="whitespace-pre-wrap wrap-break-word text-sm text-gray-800 leading-6">
                {textBody}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Interview View Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-3 sm:px-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div className="relative bg-white w-full max-w-2xl rounded-xl shadow-xl border overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-b">
              <div className="min-w-0">
                <h4 className="text-base sm:text-lg font-semibold text-gray-900">
                  Interview Questions
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 truncate">
                  {activeJob?.title} • {activeJob?.company}
                </p>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700 select-none">
                <input
                  type="checkbox"
                  checked={showCorrect}
                  onChange={(e) => setShowCorrect(e.target.checked)}
                  className="h-4 w-4"
                />
                Show correct answers
              </label>
            </div>
            <div className="p-4 max-h-[70vh] overflow-y-auto space-y-4">
              {Array.isArray(activeJob?.mcqs) && activeJob.mcqs.length > 0 ? (
                activeJob.mcqs.map((m, i) => (
                  <div key={i} className="border rounded-lg p-3 sm:p-4">
                    <p className="font-semibold text-gray-900">{m.question}</p>
                    <div className="mt-3 space-y-2">
                      {(m.options || []).map((op, idx) => {
                        const isCorrect = Number(m.correctOption) === idx;
                        return (
                          <div
                            key={idx}
                            className={`text-sm border rounded-md px-3 py-2 ${
                              showCorrect && isCorrect
                                ? "bg-green-50 border-green-400 text-green-800 font-semibold"
                                : "bg-gray-50"
                            }`}
                          >
                            {String.fromCharCode(65 + idx)}. {op}
                            {showCorrect && isCorrect ? " ✅" : ""}
                          </div>
                        );
                      })}
                    </div>
                    {showCorrect && (
                      <p className="mt-2 text-xs text-gray-500">
                        Correct option index: {Number(m.correctOption) + 1}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-lg border bg-gray-50 text-gray-700">
                  No interview questions added yet.
                </div>
              )}
            </div>
            <div className="p-4 border-t flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-black transition active:scale-[0.99]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Modal */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-3 sm:px-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeEditModal} />
          <div className="relative bg-white w-full max-w-2xl rounded-xl shadow-xl border overflow-hidden">
            <div className="p-4 border-b flex items-start justify-between gap-3">
              <div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-900">Edit Job</h4>
                <p className="text-xs sm:text-sm text-gray-600">Update job fields and save.</p>
              </div>
            </div>
            <div className="p-4 max-h-[70vh] overflow-y-auto">
              {editError ? (
                <div className="mb-3 p-3 rounded-md border border-red-200 bg-red-50 text-red-700 text-sm">
                  {editError}
                </div>
              ) : null}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-700">Job Title</label>
                  <input
                    value={editJob.jobTitle}
                    onChange={(e) => updateEditField("jobTitle", e.target.value)}
                    className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    placeholder="Job Title"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700">Company</label>
                  <input
                    value={editJob.company}
                    onChange={(e) => updateEditField("company", e.target.value)}
                    className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    placeholder="Company"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700">Location</label>
                  <input
                    value={editJob.location}
                    onChange={(e) => updateEditField("location", e.target.value)}
                    className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    placeholder="Location"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700">Category</label>
                  <input
                    value={editJob.category}
                    onChange={(e) => updateEditField("category", e.target.value)}
                    className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    placeholder="Category"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700">Salary</label>
                  <input
                    value={editJob.salary}
                    onChange={(e) => updateEditField("salary", e.target.value)}
                    className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    placeholder="Salary"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700">Vacancies</label>
                  <input
                    value={editJob.vacancies}
                    onChange={(e) => updateEditField("vacancies", e.target.value)}
                    className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    placeholder="Vacancies"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-700">Description</label>
                  <textarea
                    value={editJob.description}
                    onChange={(e) => updateEditField("description", e.target.value)}
                    className="mt-1 w-full border rounded-md px-3 py-2 min-h-[110px] focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    placeholder="Description"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-700">Requirements</label>
                  <textarea
                    value={editJob.requirements}
                    onChange={(e) => updateEditField("requirements", e.target.value)}
                    className="mt-1 w-full border rounded-md px-3 py-2 min-h-[110px] focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    placeholder="Requirements"
                  />
                </div>
              </div>
            </div>
            <div className="p-4 border-t flex flex-col sm:flex-row justify-end gap-2">
              <button
                onClick={closeEditModal}
                className="w-full sm:w-auto px-4 py-2 rounded-md border hover:bg-gray-50 transition active:scale-[0.99]"
                disabled={editSaving}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateJob}
                className="w-full sm:w-auto px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60 transition active:scale-[0.99]"
                disabled={editSaving}
              >
                {editSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modals */}
      <AddJobModal
        open={addOpen}
        onClose={closeAddJobModal}
        onCreate={handleCreateJob}
        newJob={newJob}
        updateJobField={updateJobField}
        addError={addError}
      />
      <AddInterviewQuestionModal
        open={iqOpen}
        onClose={closeInterviewQuestionModal}
        jobs={uiJobs}
        iqJobId={iqJobId}
        setIqJobId={setIqJobId}
        mcqForm={mcqForm}
        updateMcqField={updateMcqField}
        updateMcqOption={updateMcqOption}
        onSave={handleSaveInterviewQuestions}
        iqError={iqError}
      />
    </div>
  );
}
