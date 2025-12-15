import { useState } from "react";

export default function PostJob({ setCurrentPage, jobs, setJobs }) {
  const [job, setJob] = useState({
    title: "",
    company: "",
    location: "",
    category: "",
    salary: "",
    description: "",
    requirements: "",
    vacancies: "",
    status: "Pending ", // for admin later
    mcqs: [],                    // will be added from AddMCQs
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const newJob = {
      ...job,
      id: jobs.length + 1,
    };

    setJobs([...jobs, newJob]);
    alert("Job submitted & waiting for Admin approval!");

    //  After submitting, go to All Jobs page
    setCurrentPage("alljobs");
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

        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Post a Job</h2>

          <form onSubmit={handleSubmit}>
            {/* Job Title */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">
                Job Title
              </label>
              <input
                type="text"
                value={job.title}
                onChange={(e) => setJob({ ...job, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>

            {/* Company */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">
                Company
              </label>
              <input
                type="text"
                value={job.company}
                onChange={(e) => setJob({ ...job, company: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>

            {/* Location */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">
                Location
              </label>
              <input
                type="text"
                value={job.location}
                onChange={(e) => setJob({ ...job, location: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>

            {/* Category */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">
                Category
              </label>
              <input
                type="text"
                value={job.category}
                onChange={(e) => setJob({ ...job, category: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>

            {/* Salary */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">
                Salary
              </label>
              <input
                type="text"
                value={job.salary}
                onChange={(e) => setJob({ ...job, salary: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">
                Description
              </label>
              <textarea
                value={job.description}
                onChange={(e) =>
                  setJob({ ...job, description: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
                rows="4"
                required
              ></textarea>
            </div>

            {/* Requirements */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">
                Requirements
              </label>
              <textarea
                value={job.requirements}
                onChange={(e) =>
                  setJob({ ...job, requirements: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
                rows="4"
                required
              ></textarea>
            </div>

            {/* Vacancies */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium">
                Vacancies
              </label>
              <input
                type="number"
                value={job.vacancies}
                onChange={(e) =>
                  setJob({ ...job, vacancies: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>

            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Submit Job
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
