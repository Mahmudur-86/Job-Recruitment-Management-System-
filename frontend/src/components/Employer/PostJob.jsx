import { useState } from 'react';

export default function PostJob({ setCurrentPage, jobs, setJobs }) {

  const [job, setJob] = useState({
    title: '',
    company: '',
    location: '',
    category: 'Full-time',
    description: '',
    requirements: '',
    salary: '',
    deadline: '',
    department: ''
  });

  // 4 ta MCQ default
  const [mcqs, setMcqs] = useState([
    { question: '', options: ['', '', '', ''], correctOptionIndex: 0 },
    { question: '', options: ['', '', '', ''], correctOptionIndex: 0 },
    { question: '', options: ['', '', '', ''], correctOptionIndex: 0 },
    { question: '', options: ['', '', '', ''], correctOptionIndex: 0 },
  ]);

  const handleMcqChange = (index, field, value) => {
    const updated = [...mcqs];
    if (field === 'question') {
      updated[index].question = value;
    }
    setMcqs(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...mcqs];
    updated[qIndex].options[optIndex] = value;
    setMcqs(updated);
  };

  const handleCorrectChange = (qIndex, value) => {
    const updated = [...mcqs];
    updated[qIndex].correctOptionIndex = Number(value);
    setMcqs(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // filter out completely empty questions
    const cleanedMcqs = mcqs.filter(
      q => q.question.trim() !== '' && q.options.some(o => o.trim() !== '')
    );

    const newJob = {
      ...job,
      id: jobs.length + 1,
      applications: 0,
      mcqs: cleanedMcqs,   // IMPORTANT: interview questions per job
    };

    setJobs([...jobs, newJob]);

    alert('Job posted successfully with interview MCQs!');
    setCurrentPage('managejobs');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-8">
        <button 
          onClick={() => setCurrentPage('dashboard')}
          className="mb-4 text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </button>

        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Post a Job</h2>

          <form onSubmit={handleSubmit}>
            {/* Job Title */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">Job Title</label>
              <input
                type="text"
                value={job.title}
                onChange={(e) => setJob({ ...job, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Company Name */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">Company Name</label>
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
              <label className="block text-gray-700 mb-2 font-medium">Location</label>
              <input
                type="text"
                value={job.location}
                onChange={(e) => setJob({ ...job, location: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>

            {/* Job Description */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">Job Description</label>
              <textarea
                value={job.description}
                onChange={(e) => setJob({ ...job, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                rows="4"
                required
              />
            </div>

            {/* Requirements */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">Requirements</label>
              <textarea
                value={job.requirements}
                onChange={(e) => setJob({ ...job, requirements: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="4"
                required
              />
            </div>

            {/* Salary Range */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">Salary Range</label>
              <input
                type="text"
                value={job.salary}
                onChange={(e) => setJob({ ...job, salary: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 50k - 70k"
                required
              />
            </div>

            {/* Deadline */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">Application Deadline</label>
              <input
                type="date"
                value={job.deadline}
                onChange={(e) => setJob({ ...job, deadline: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Department */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium">Department</label>
              <input
                type="text"
                value={job.department}
                onChange={(e) => setJob({ ...job, department: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* INTERVIEW MCQs SECTION */}
            <div className="mb-6 border-t pt-4">
              <h3 className="text-lg font-semibold mb-3">Interview MCQ Questions (for Job Seekers)</h3>
              <p className="text-sm text-gray-500 mb-3">
                Job seeker will answer these during application. Score will go to ViewApplications page.
              </p>

              {mcqs.map((q, qIndex) => (
                <div key={qIndex} className="mb-4 p-3 border rounded-lg bg-gray-50">
                  <label className="block text-gray-700 mb-2 font-medium">
                    Question {qIndex + 1}
                  </label>
                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) => handleMcqChange(qIndex, 'question', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg mb-3"
                    placeholder="Type the question..."
                  />

                  {q.options.map((opt, optIndex) => (
                    <div key={optIndex} className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium">
                        Option {String.fromCharCode(65 + optIndex)}:
                      </span>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-lg"
                        placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                      />
                    </div>
                  ))}

                  <div className="mt-2">
                    <label className="block text-sm font-medium mb-1">Correct Option</label>
                    <select
                      value={q.correctOptionIndex}
                      onChange={(e) => handleCorrectChange(qIndex, e.target.value)}
                      className="px-3 py-2 border rounded-lg"
                    >
                      <option value={0}>A</option>
                      <option value={1}>B</option>
                      <option value={2}>C</option>
                      <option value={3}>D</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Post Job
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
