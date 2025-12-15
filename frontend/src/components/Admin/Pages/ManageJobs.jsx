import React, { useMemo, useState } from "react";

export default function ManageJobs() {
  // ✅ initial jobs (dummy)
  const initialJobs = useMemo(
    () => [
      {
        _id: "1",
        jobTitle: "MERN Developer",
        company: "EconoTech",
        location: "Gulshan, Dhaka",
        category: "Full-time",
        salary: "Negotiable",
        description: "Looking for an experienced MERN Developer",
        requirements: "MongoDB, Express.js, React.js, Node.js",
        vacancies: 2,

        // ✅ default Approved (you can change to Pending if you want)
        status: "Approved",

        // ✅ job-wise MCQs (MERN)
        mcqs: [
          {
            question: "1. Which stack correctly represents MERN?",
            options: [
              "MongoDB, Express, React, Node.js",
              "MySQL, Express, Redux, Node.js",
              "MongoDB, Electron, React, Next.js",
              "MariaDB, Ember, React, Node.js",
            ],
            correctOption: 0,
          },
          {
            question:
              "2. In Express.js, which method is commonly used to parse JSON request bodies?",
            options: ["express.json()", "bodyParser.html()", "app.view()", "req.parse()"],
            correctOption: 0,
          },
          {
            question:
              "3. In MongoDB, which command is used to find documents that match a filter?",
            options: ["find()", "select()", "get()", "match()"],
            correctOption: 0,
          },
        ],
      },

      // ✅ NEW JOB (Frontend Developer)
      {
        _id: "2",
        jobTitle: "Frontend Developer",
        company: "TechNova",
        location: "Banani, Dhaka",
        category: "Full-time",
        salary: "30k-45k",
        description: "Need React developer with Tailwind experience",
        requirements: "React, Tailwind, JavaScript",
        vacancies: 3,

        // ✅ default Approved (you can change to Pending if you want)
        status: "Approved",

        // ✅ job-wise MCQs (Frontend)
        mcqs: [
          {
            question:
              "1. Which hook is used to manage state in a React functional component?",
            options: ["useEffect", "useState", "useRef", "useMemo"],
            correctOption: 1,
          },
          {
            question: "2. What is Tailwind CSS mainly used for?",
            options: [
              "Backend API development",
              "Database management",
              "Utility-first CSS styling",
              "State management",
            ],
            correctOption: 2,
          },
          {
            question: "3. In React, what does JSX allow you to do?",
            options: [
              "Write HTML-like syntax inside JavaScript",
              "Create SQL queries",
              "Build APIs without Express",
              "Replace JavaScript completely",
            ],
            correctOption: 0,
          },
        ],
      },
    ],
    []
  );

  // ✅ jobs state
  const [jobs, setJobs] = useState(initialJobs);

  // ✅ Modal state
  const [open, setOpen] = useState(false);
  const [activeJob, setActiveJob] = useState(null);

  // ✅ fallback Dummy interview questions (if job has no mcqs)
  const interviewQuestions = useMemo(
    () => [
      {
        q: "1. Which stack correctly represents MERN?",
        options: [
          "A. MongoDB, Express, React, Node.js",
          "B. MySQL, Express, Redux, Node.js",
          "C. MongoDB, Electron, React, Next.js",
          "D. MariaDB, Ember, React, Node.js",
        ],
      },
      {
        q: "2. In Express.js, which method is commonly used to parse JSON request bodies?",
        options: ["A. express.json()", "B. bodyParser.html()", "C. app.view()", "D. req.parse()"],
      },
      {
        q: "3. In MongoDB, which command is used to find documents that match a filter?",
        options: ["A. find()", "B. select()", "C. get()", "D. match()"],
      },
    ],
    []
  );

  // ✅ modal handlers
  const openModal = (job) => {
    setActiveJob(job);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setActiveJob(null);
  };

  // ✅ actions
  const handleApprove = (jobId) => {
    setJobs((prev) =>
      prev.map((j) => (j._id === jobId ? { ...j, status: "Approved" } : j))
    );
  };

  // ✅ NEW: Pending action
  const handlePending = (jobId) => {
    setJobs((prev) =>
      prev.map((j) => (j._id === jobId ? { ...j, status: "Pending" } : j))
    );
  };

  const handleReject = (jobId) => {
    setJobs((prev) =>
      prev.map((j) => (j._id === jobId ? { ...j, status: "Rejected" } : j))
    );
  };

  const handleDelete = (jobId) => {
    setJobs((prev) => prev.filter((j) => j._id !== jobId));
    if (activeJob?._id === jobId) closeModal();
  };

  // ✅ status badge style
  const statusBadge = (status) => {
    if (status === "Approved")
      return "bg-green-100 text-green-800 border border-green-200";
    if (status === "Rejected")
      return "bg-red-100 text-red-800 border border-red-200";
    return "bg-yellow-100 text-yellow-800 border border-yellow-200";
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Manage Jobs</h3>
        <p className="text-gray-600 text-sm">
          Admin can see all job posts and delete jobs if necessary.
        </p>
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
                  "Status",
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
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-4 py-6 text-center text-gray-600">
                    No jobs found.
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
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

                    {/* Description */}
                    <td className="px-4 py-3 text-sm text-gray-700 max-w-[260px]">
                      <div className="line-clamp-2 wrap-break-word">{job.description}</div>
                    </td>

                    {/* Requirements */}
                    <td className="px-4 py-3 text-sm text-gray-700 max-w-60">
                      <div className="line-clamp-2 wrap-break-word">{job.requirements}</div>
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-800 whitespace-nowrap">
                      {job.vacancies}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      <button
                        onClick={() => openModal(job)}
                        className="px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-100 whitespace-nowrap"
                      >
                        See Interview Question
                      </button>
                    </td>

                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${statusBadge(
                          job.status
                        )}`}
                      >
                        {job.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(job._id)}
                          className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                          Approve
                        </button>

                        {/* ✅ NEW Pending Button */}
                        <button
                          onClick={() => handlePending(job._id)}
                          className="px-3 py-1.5 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                        >
                          Pending
                        </button>

                        <button
                          onClick={() => handleReject(job._id)}
                          className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                          Reject
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

      {/* Interview Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div className="relative bg-white w-full max-w-2xl rounded-lg shadow-lg border">
            <div className="flex justify-between items-center p-4 border-b">
              <div>
                <h4 className="text-lg font-semibold">Interview Questions</h4>
                <p className="text-sm text-gray-600">
                  {activeJob?.jobTitle} • {activeJob?.company}
                </p>
              </div>
            </div>

            <div className="p-4 max-h-[70vh] overflow-y-auto space-y-4">
              {/* ✅ show job specific MCQs if available */}
              {Array.isArray(activeJob?.mcqs) && activeJob.mcqs.length > 0 ? (
                activeJob.mcqs.map((m, i) => (
                  <div key={i} className="border rounded-md p-3">
                    <p className="font-semibold">{m.question}</p>
                    <div className="mt-2 space-y-2">
                      {(m.options || []).map((op, idx) => (
                        <div
                          key={idx}
                          className="text-sm bg-gray-50 border rounded-md px-3 py-2"
                        >
                          {String.fromCharCode(65 + idx)}. {op}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                // ✅ fallback dummy (old)
                interviewQuestions.map((q, i) => (
                  <div key={i} className="border rounded-md p-3">
                    <p className="font-semibold">{q.q}</p>
                    <div className="mt-2 space-y-2">
                      {q.options.map((op, idx) => (
                        <div
                          key={idx}
                          className="text-sm bg-gray-50 border rounded-md px-3 py-2"
                        >
                          {op}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t flex justify-end">
              <button onClick={closeModal} className="px-4 py-2 bg-gray-900 text-white rounded-md">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
