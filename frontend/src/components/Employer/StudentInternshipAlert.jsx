

export default function StudentInternshipAlert({ 
  setCurrentPage, 
  alert, 
  setAlert, 
  isAlertActive, 
  setIsAlertActive 
}) {
  return (
    <div className="min-h-screen bg-gray-100">
    
      <div className="container mx-auto p-8">
        <button onClick={() => setCurrentPage('dashboard')} className="mb-4 text-blue-600 hover:underline">
          ← Back to Dashboard
        </button>
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Student Internship Alert</h2>
          
          {isAlertActive && (
            <div className="mb-6 p-4 bg-green-100 border-2 border-green-400 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl"></span>
                <p className="text-green-800 font-bold">Alert is Pending!</p>
              </div>
              <p className="text-green-700 text-sm mb-3">
               Wait for admin approval and when it is approved. Emails will be sent automatically every 7 days for the next 30 days
              </p>
              <button 
                onClick={() => {
                  if (window.confirm('Stop sending alerts?')) {
                    setIsAlertActive(false);
                    alert('Alert stopped successfully');
                  }
                }}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Stop Alert
              </button>
            </div>
          )}

          <form onSubmit={(e) => {
            e.preventDefault();
            setIsAlertActive(true);
            alert('Alert created! It will be sent every 7 days for one month.');
          }}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">Company Name</label>
              <input
                type="text"
                value={alert.companyName}
                onChange={(e) => setAlert({...alert, companyName: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
                placeholder="EconoTech"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">Department</label>
              <input
                type="text"
                value={alert.department}
                onChange={(e) => setAlert({...alert, department: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
                placeholder="CSE"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium"> University Name</label>
              <input
                type="text"
                value={alert.university}
                onChange={(e) => setAlert({...alert, university: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., IUBAT, AIUB"
                required
              />
            </div>


                <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium"> University Mail</label>
              <input
                type="text"
                value={alert.universityMail}
                onChange={(e) => setAlert({...alert, universityMail: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="www.iubat.edu.cse"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">Position</label>
              <input
                type="text"
                value={alert.position}
                onChange={(e) => setAlert({...alert, position: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
                placeholder="Backend Developer Intern"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">Duration</label>
              <input
                type="text"
                value={alert.duration}
                onChange={(e) => setAlert({...alert, duration: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 4 months, 6 months"
                required
              />
            </div>
          
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium">Contact</label>
              <input
                type="text"
                value={alert.contact}
                onChange={(e) => setAlert({...alert, contact: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="01789789452"
                required
              />
            </div>
            <button 
              disabled={isAlertActive}
              className={`w-full py-3 rounded-lg font-medium ${
                isAlertActive 
                  ? 'bg-gray-400 cursor-not-allowed text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isAlertActive ? 'Alert Already Active' : 'Create & Send Alert'}
            </button>
            <p className="text-xs text-gray-500 mt-3 text-center">
               Alert will be sent every 7 days automatically for 30 days after approval
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}