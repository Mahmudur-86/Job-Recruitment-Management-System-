import NavBar from './NavBar';

export default function StudentInternList({ 
  setCurrentPage, 
  students, 
  universityFilter, 
  setUniversityFilter 
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="container mx-auto p-8">
        <button onClick={() => setCurrentPage('dashboard')} className="mb-4 text-blue-600 hover:underline">
          ← Back to Dashboard
        </button>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Student Intern List</h2>
          
          <div className="mb-6 bg-white p-4 rounded-lg shadow">
            <label className="block text-gray-700 mb-2 font-medium">Filter by University</label>
            <input
              type="text"
              value={universityFilter}
              onChange={(e) => setUniversityFilter(e.target.value)}
              placeholder="Enter university name (e.g., MIT, Stanford)"
              className="px-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-4">
            {students
              .filter(s => s.university.toLowerCase().includes(universityFilter.toLowerCase()))
              .map(student => (
                <div key={student.id} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold">{student.name}</h3>
                      <p className="text-gray-600">🎓 {student.university} - {student.major}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-sm text-gray-500">Overall Score:</span>
                        <span className={`font-bold ${student.score >= 90 ? 'text-green-600' : 'text-orange-600'}`}>
                          {student.score}/100
                        </span>
                        {student.score >= 90 && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Eligible for Interview</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">📄 CV: {student.cv}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        View CV
                      </button>
                      <button 
                        onClick={() => {
                          if (student.score >= 90) {
                            alert(`Interview invitation sent to ${student.name}! ✅`);
                          } else {
                            alert(`${student.name}'s score (${student.score}) is below the minimum requirement of 90 ❌`);
                          }
                        }}
                        className={`px-4 py-2 rounded text-white ${
                          student.score >= 90 
                            ? 'bg-green-500 hover:bg-green-600' 
                            : 'bg-gray-400 cursor-not-allowed'
                        }`}
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