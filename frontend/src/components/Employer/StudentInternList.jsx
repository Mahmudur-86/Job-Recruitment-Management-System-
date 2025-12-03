import { useState } from "react";

export default function StudentInternList({
  setCurrentPage,
  students,
  universityFilter,
  setUniversityFilter
}) {

  const [showMailBox, setShowMailBox] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const openMailBox = (student) => {
    setSelectedStudent(student);
    setShowMailBox(true);
  };

  const sendMail = () => {
    alert(`Interview mail sent to ${selectedStudent.studentName}`);
    setShowMailBox(false);
    setSelectedStudent(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 relative">

      {/* ============================
          INTERVIEW MAIL MODAL
      ============================= */}
      {showMailBox && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-[400px] p-6 rounded-xl shadow-lg animate-fadeIn">

            <h3 className="text-xl font-semibold mb-4">
              Send Interview Invitation
            </h3>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">To:</p>
                <p className="text-base font-medium">{selectedStudent.email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Student:</p>
                <p className="text-base font-medium">{selectedStudent.studentName}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Subject:</p>
                <p className="text-gray-700 border p-2 rounded-md bg-gray-50">
                  Internship Interview Invitation
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Message:</p>
                <textarea
                  className="w-full border rounded-md p-2 bg-gray-50 text-gray-700"
                  rows={4}
                  defaultValue={
`Dear ${selectedStudent.studentName},

You have been shortlisted for an interview regarding our Internship Program.

We will contact you soon with further details.

Best Regards,
Employer Team`
                  }
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowMailBox(false)}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={sendMail}
                className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
              >
                Send Mail
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN PAGE */}
      <div className="container mx-auto p-8">

        <button
          onClick={() => setCurrentPage("dashboard")}
          className="mb-4 text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </button>

        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Student Intern List</h2>

          {/* Filter */}
          <div className="mb-6 bg-white p-4 rounded-lg shadow">
            <label className="block font-medium mb-2">Filter by University</label>
            <input
              type="text"
              value={universityFilter}
              onChange={(e) => setUniversityFilter(e.target.value)}
              placeholder="Search University..."
              className="px-4 py-2 border rounded-lg w-full"
            />
          </div>

          {/* Student Cards */}
          <div className="space-y-4">
            {students
              .filter(s =>
                s.university.toLowerCase().includes(universityFilter.toLowerCase())
              )
              .map(student => (
                <div key={student.id} className="bg-white p-6 rounded-lg shadow-md">
                  
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold">{student.studentName}</h3>

                      <p className="text-gray-600">
                        🎓 {student.university} — {student.department}
                      </p>

                      <p className="text-sm text-gray-500 mt-1">Batch: {student.batch}</p>
                      <p className="text-sm text-gray-500">Student ID: {student.studentId}</p>
                      <p className="text-sm text-gray-500">Email: {student.email}</p>

                      <p className="text-xs text-gray-400 mt-2">
                        📄 CV: {student.cvName || "Not Provided"}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        View CV
                      </button>

                      <button
                        onClick={() => openMailBox(student)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      >
                        Send Interview
                      </button>
                    </div>
                  </div>

                </div>
              ))}
          </div>

        </div>
      </div>
    </div>
  );
}
