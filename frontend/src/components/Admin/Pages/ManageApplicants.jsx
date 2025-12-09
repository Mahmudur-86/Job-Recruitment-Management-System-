import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ManageApplicants() {
  const [applications, setApplications] = useState([]);
  const [interviewQuestions, setInterviewQuestions] = useState([
    {
      question: "What is the primary function of a backend developer?",
      options: [
        "Designing the user interface",
        "Writing server-side logic and APIs",
        "Managing front-end frameworks",
        "Creating the visual design of the website",
      ],
    },
    {
      question: "Which of the following is a common choice for relational databases in backend development?",
      options: [
        "MongoDB",
        "PostgreSQL",
        "Redis",
        "Firebase",
      ],
    },
    {
      question: "Which HTTP method is used to update a resource on the server?",
      options: [
        "GET",
        "POST",
        "PUT",
        "DELETE",
      ],
    },
  ]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        // Dummy data for testing, replace with actual API call.
        const dummyApplications = [
          {
            _id: "1",
            user: { name: "Md. Mahmudur Rahman", email: "hrid3740@gmail.com" },
            jobTitle: "Backend Developer",
            company: "EconoTech",
            status: "Pending",
            cvUrl: "/assets/cvfile/CV.pdf",
          },
        ];

        setApplications(dummyApplications); // Set dummy data
      } catch (error) {
        console.error("Error fetching applications for Admin:", error);
      }
    };

    fetchApplications();
  }, []);

  const handleStatusChange = (id, newStatus) => {
    // Function to update application status
    setApplications((prevApps) =>
      prevApps.map((app) =>
        app._id === id ? { ...app, status: newStatus } : app
      )
    );
  };

  const handleDeleteApplication = (id) => {
    // Function to delete an application
    setApplications((prevApps) =>
      prevApps.filter((app) => app._id !== id)
    );
  };

  const handleSendInterview = (id) => {
    // Function to handle sending interview questions
    const applicant = applications.find((app) => app._id === id);
    if (applicant) {
      const formattedQuestions = interviewQuestions.map(
        (q) => `${q.question}\nOptions: ${q.options.join(", ")}`
      ).join("\n\n");
      alert(`Sending interview questions to ${applicant.user.name} \n${formattedQuestions}`);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-6 text-gray-800">Manage Applicants</h3>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applicant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">View CV</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Interview Questions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {applications.map((app) => (
              <tr key={app._id}>
                <td className="px-6 py-4 text-sm text-gray-900">{app.user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{app.user.email}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{app.jobTitle}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{app.company}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${app.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : app.status === "Approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                      }`}
                  >
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <button
                    className="text-blue-600"
                    onClick={() => window.open(app.cvUrl, "_blank")}
                  >
                    View CV
                  </button>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <button
                    className="text-blue-600"
                    onClick={() => handleSendInterview(app._id)}
                  >
                    Send Interview Questions
                  </button>
                </td>
                <td className="px-6 py-4">
                  {/* Status Change Actions */}
                  <div className="flex gap-2">
                    {app.status === "Pending" && (
                      <>
                        <button
                          className="text-green-600"
                          onClick={() => handleStatusChange(app._id, "Approved")}
                        >
                          Approve
                        </button>
                        <button
                          className="text-red-600"
                          onClick={() => handleStatusChange(app._id, "Rejected")}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {app.status !== "Pending" && (
                      <button
                        className="text-blue-600"
                        onClick={() => handleStatusChange(app._id, "Pending")}
                      >
                        Pending
                      </button>
                    )}

                    {/* Delete Action */}
                    <button
                      className="text-red-600"
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
    </div>
  );
}
