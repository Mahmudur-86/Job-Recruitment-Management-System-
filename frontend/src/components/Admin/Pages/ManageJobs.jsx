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
    setShowCorrect(false); // ✅ reset each time
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
        title: newJob.jobTitle, // ✅ UI jobTitle -> DB title
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

  // UI mapping: show title as jobTitle
  const uiJobs = jobs.map((j) => ({ ...j, jobTitle: j.title }));

  
  
 
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
        title: editJob.jobTitle, // ✅ UI jobTitle -> DB title
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
          setActiveJob((prev) => (prev ? { ...prev, ...payload, title: payload.title } : prev));
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

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Manage Jobs</h3>
          <p className="text-sm text-gray-500">
            {loading ? "Loading..." : `Total: ${uiJobs.length}`}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setAddOpen(true)}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white shadow hover:bg-indigo-700 transition"
          >
            + Add Job
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="min-w-[1100px] w-full">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Job Title",
                  "Company",
                  "Location",
                  "Category",
                  "Salary",
                  "Description",
                  "Requirements",
                  "Vacancies",
                  "Interview",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={10} className="px-4 py-10 text-center text-gray-600">
                    Loading jobs...
                  </td>
                </tr>
              ) : uiJobs.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-10 text-center text-gray-600">
                    No jobs found. Click <b>+ Add Job</b> to create your first job.
                  </td>
                </tr>
              ) : (
                uiJobs.map((job) => (
                  <tr key={job._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">
                      {job.jobTitle}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 whitespace-nowrap">
                      {job.company}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 whitespace-nowrap">
                      {job.location}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 whitespace-nowrap">
                      {job.category}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 whitespace-nowrap">
                      {job.salary}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-700 max-w-[260px]">
                      <div className="line-clamp-10 wrap-break-word">{job.description}</div>
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-700 max-w-60">
                      <div className="line-clamp-9 wrap-break-word">{job.requirements}</div>
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-800 whitespace-nowrap">
                      {job.vacancies}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => openModal(job)}
                          className="px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-100 whitespace-nowrap"
                        >
                          See Interview Question
                        </button>

                        <button
                          onClick={() => openInterviewQuestionModal(job._id)}
                          className="px-3 py-1.5 rounded-md border border-indigo-300 text-indigo-700 hover:bg-indigo-50 whitespace-nowrap"
                        >
                          Add Interview Question
                        </button>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-sm">
                      <div className="flex flex-wrap gap-2">
                       
                        <button
                          onClick={() => openEditModal(job)}
                          className="px-3 py-1.5 border border-gray-300 text-gray-800 rounded-md hover:bg-gray-100"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(job._id)}
                          className="px-3 py-1.5 border border-red-300 text-red-700 rounded-md hover:bg-red-50"
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

      {/* Interview View Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div className="relative bg-white w-full max-w-2xl rounded-lg shadow-lg border">
            <div className="flex justify-between items-center p-4 border-b">
              <div>
                <h4 className="text-lg font-semibold">Interview Questions</h4>
                <p className="text-sm text-gray-600">
                  {activeJob?.title} • {activeJob?.company}
                </p>
              </div>

              
              <label className="flex items-center gap-2 text-sm text-gray-700 select-none">
                <input
                  type="checkbox"
                  checked={showCorrect}
                  onChange={(e) => setShowCorrect(e.target.checked)}
                />
                Show correct answers
              </label>
            </div>

            <div className="p-4 max-h-[70vh] overflow-y-auto space-y-4">
              {Array.isArray(activeJob?.mcqs) && activeJob.mcqs.length > 0 ? (
                activeJob.mcqs.map((m, i) => (
                  <div key={i} className="border rounded-md p-3">
                    <p className="font-semibold">{m.question}</p>

                    <div className="mt-2 space-y-2">
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

                    {/* Optional small hint line */}
                    {showCorrect && (
                      <p className="mt-2 text-xs text-gray-500">
                        Correct option index: {Number(m.correctOption) + 1}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-md border bg-gray-50 text-gray-700">
                  No interview questions added yet.
                </div>
              )}
            </div>

            <div className="p-4 border-t flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-900 text-white rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeEditModal} />
          <div className="relative bg-white w-full max-w-2xl rounded-lg shadow-lg border">
            <div className="p-4 border-b flex items-start justify-between gap-3">
              <div>
                <h4 className="text-lg font-semibold">Edit Job</h4>
                <p className="text-sm text-gray-600">Update job fields and save.</p>
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
                    className="mt-1 w-full border rounded-md px-3 py-2"
                    placeholder="Job Title"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-700">Company</label>
                  <input
                    value={editJob.company}
                    onChange={(e) => updateEditField("company", e.target.value)}
                    className="mt-1 w-full border rounded-md px-3 py-2"
                    placeholder="Company"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-700">Location</label>
                  <input
                    value={editJob.location}
                    onChange={(e) => updateEditField("location", e.target.value)}
                    className="mt-1 w-full border rounded-md px-3 py-2"
                    placeholder="Location"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-700">Category</label>
                  <input
                    value={editJob.category}
                    onChange={(e) => updateEditField("category", e.target.value)}
                    className="mt-1 w-full border rounded-md px-3 py-2"
                    placeholder="Category"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-700">Salary</label>
                  <input
                    value={editJob.salary}
                    onChange={(e) => updateEditField("salary", e.target.value)}
                    className="mt-1 w-full border rounded-md px-3 py-2"
                    placeholder="Salary"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-700">Vacancies</label>
                  <input
                    value={editJob.vacancies}
                    onChange={(e) => updateEditField("vacancies", e.target.value)}
                    className="mt-1 w-full border rounded-md px-3 py-2"
                    placeholder="Vacancies"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm text-gray-700">Description</label>
                  <textarea
                    value={editJob.description}
                    onChange={(e) => updateEditField("description", e.target.value)}
                    className="mt-1 w-full border rounded-md px-3 py-2 min-h-[110px]"
                    placeholder="Description"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm text-gray-700">Requirements</label>
                  <textarea
                    value={editJob.requirements}
                    onChange={(e) => updateEditField("requirements", e.target.value)}
                    className="mt-1 w-full border rounded-md px-3 py-2 min-h-[110px]"
                    placeholder="Requirements"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border-t flex justify-end gap-2">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 rounded-md border hover:bg-gray-50"
                disabled={editSaving}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateJob}
                className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
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
