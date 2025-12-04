// ApplicationsTab.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ApplicationsTab() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetching applications for the logged-in user
        const response = await axios.get(
          "http://localhost:5000/api/job-applications/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setApplications(response.data); // Store applications with MCQ history
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Applications</h2>

      {applications.length > 0 ? (
        applications.map((app) => (
          <div key={app._id} className="p-4 mb-3 bg-white rounded-lg shadow border">
            <h3 className="text-lg font-semibold">{app.jobTitle}</h3>
            <p className="text-gray-600">Company: {app.company}</p>
            <p className="text-gray-600">Applied Date: {new Date(app.appliedDate).toLocaleDateString()}</p>
            <p className="text-gray-600">CV: {app.cvName}</p> {/* Display CV name */}

            <span
              className={`px-3 py-1 rounded text-sm font-semibold mt-2 inline-block ${
                app.status === "Pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : app.status === "Approved"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {app.status}
            </span>

            {/* MCQ History: Display each selected answer */}
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Your Answers:</h4>

              {app.mcqHistory?.map((q, i) => (
                <div key={i} className="mb-2 p-2 bg-gray-50 border rounded">
                  <p><strong>{i + 1}. {q.question}</strong></p>
                  <p>Your Answer: {q.selectedOption}</p>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>No applications found.</p>
      )}
    </div>
  );
}
