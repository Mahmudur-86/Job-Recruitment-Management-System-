import NavBar from './NavBar';
import EmailModal from './EmailModal';

export default function ViewApplications({ 
  setCurrentPage, 
  applications, 
  showEmailModal, 
  setShowEmailModal, 
  selectedPerson, 
  setSelectedPerson 
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="container mx-auto p-8">
        <button onClick={() => setCurrentPage('managejobs')} className="mb-4 text-blue-600 hover:underline">
          ← Back to Jobs
        </button>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Applications for Frontend Developer</h2>
          <div className="space-y-4">
            {applications.map(app => (
              <div key={app.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{app.name}</h3>
                    <p className="text-gray-600">{app.email}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-sm text-gray-500">Interview Score:</span>
                      <span className={`font-bold ${app.score >= 85 ? 'text-green-600' : 'text-orange-600'}`}>
                        {app.score}/100
                      </span>
                      {app.score >= 85 && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">High Score</span>}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">📄 CV: {app.cv}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                      View CV
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedPerson(app);
                        setShowEmailModal(true);
                      }}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Email
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {showEmailModal && selectedPerson && (
        <EmailModal person={selectedPerson} onClose={() => setShowEmailModal(false)} />
      )}
    </div>
  );
}