import EmailModal from './EmailModal';

export default function ViewApplications({ 
  setCurrentPage, 
  applications, 
  showEmailModal, 
  setShowEmailModal, 
  selectedPerson, 
  setSelectedPerson 
}) {

  //  Auto score calculation
  const calculateScore = (correct, total) => {
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
  };

  //  Dummy Applications 
  const dummyApplications = [
    {
      id: 1,
      name: "Mahmudur Rahman",
      email: "hrid3740@gmail.com",
      jobTitle: "Backend Developer ",
      company: "EconoTech",
      appliedDate: "2025-05-12",
      correctCount: 3,
      totalQuestions: 4,
      score: calculateScore(3, 4),
      cv: "cv_mahmudur.pdf",
    },
  
  
  ];

  //  Merge real + dummy
  const allApplications = [...applications, ...dummyApplications];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-8">

        {/* BACK BUTTON */}
        <button 
          onClick={() => setCurrentPage('dashboard')} 
          className="mb-4 text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </button>

        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Applications</h2>

          <div className="space-y-4">

            {allApplications.map(app => (
              <div key={app.id} className="bg-white p-6 rounded-lg shadow-md">

                <div className="flex justify-between items-start">

                  {/* LEFT SIDE */}
                  <div>
                    <h3 className="text-xl font-bold">{app.name}</h3>
                    <p className="text-gray-600">{app.email}</p>

                    <p className="text-sm text-gray-500 mt-1">
                      Applied for: <span className="font-semibold">{app.jobTitle}</span>  
                      at {app.company}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      Applied on: {app.appliedDate}
                    </p>

                    {/* SCORE SECTION */}
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-sm text-gray-500">Interview Score:</span>

                      <span
                        className={`font-bold ${
                          app.score >= 75 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {app.score}% ({app.correctCount}/{app.totalQuestions})
                      </span>

                      {app.score >= 75 ? (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          PASS
                        </span>
                      ) : (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                          FAIL
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-400 mt-2">
                      📄 CV: {app.cv || 'Not provided'}
                    </p>
                  </div>

                  {/* RIGHT BUTTONS */}
                  <div className="flex gap-2">
                    <button 
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      onClick={() => {
                        if (app.cv) window.open(app.cv, "_blank");
                        else alert("No CV available.");
                      }}
                    >
                      View CV
                    </button>

                    <button 
                      onClick={() => {
                        setSelectedPerson({ name: app.name, email: app.email });
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
        <EmailModal 
          person={selectedPerson} 
          onClose={() => setShowEmailModal(false)} 
        />
      )}
    </div>
  );
}
