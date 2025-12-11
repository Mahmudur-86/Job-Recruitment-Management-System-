import { useState } from 'react';


import EmailModal from './EmailModal';
import InterviewModal from './InterviewModal';

export default function ViewApplications({ 
  setCurrentPage, 
  applications, 
  showEmailModal, 
  setShowEmailModal, 
  selectedPerson, 
  setSelectedPerson
}) {

  const [showInterviewModal, setShowInterviewModal] = useState(false);

  // Dummy Applications 
  const dummyApplications = [
    {
      id: 1,
      name: "Md. Mahmudur Rahman",
      email: "hrid3740@gmail.com",
      jobTitle: "Backend Developer",
      company: "EconoTech",
      appliedDate: "9-12-2025",
      cvUrl: "/assets/cvfile/CV.pdf",

      // NEW: Dummy answers for interview
      interviewAnswers: [
        {
          question: "1. Which HTTP method is commonly used to update a resource?",
          options: ["GET", "POST", "PUT", "DELETE"],
          answer: "PUT"
        },
        {
          question: "2. Which database is a NoSQL Database?",
          options: ["MySQL", "PostgreSQL", "MongoDB", "Oracle"],
          answer: "MongoDB"
        },
        {
          question: "3. What is the purpose of middleware in Express.js?",
          options: [
            "To handle CSS files",
            "To modify request/response objects",
            "To store images",
            "To create database tables"
          ],
          answer: "To modify request/response objects"
        }
      ]
    },
  ];

  // Merge real + dummy
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
                    <p className="text-gray-700">{app.email}</p>

                    <p className="text-sm text-gray-700 mt-1">
                      Applied for: <span className="font-semibold">{app.jobTitle}</span>  
                      at {app.company}
                    </p>

                    <p className="text-xs text-gray-700 mt-1">
                      Applied on: {app.appliedDate}
                    </p>

                    <p className="text-xs text-gray-700 mt-2">
                       CV: {app.cvUrl || 'Not provided'}
                    </p>
                  </div>

                  {/* RIGHT BUTTONS */}
                  <div className="flex gap-2">

                    {/* VIEW CV BUTTON */}
                    <button 
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      onClick={() => {
                        if (app.cvUrl) window.open(app.cvUrl, "_blank");
                        else alert("No CV available.");
                      }}
                    >
                      View CV
                    </button>

                    {/* EMAIL BUTTON */}
                    <button 
                      onClick={() => {
                        setSelectedPerson({ name: app.name, email: app.email });
                        setShowEmailModal(true);
                      }}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Email
                    </button>

                    {/* NEW: VIEW INTERVIEW ANSWERS BUTTON */}
                    <button
                      onClick={() => {
                        setSelectedPerson(app);
                        setShowInterviewModal(true);
                      }}
                      className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700"
                    >
                      View Answers
                    </button>

                  </div>
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>

      {/* EMAIL MODAL */}
      {showEmailModal && selectedPerson && (
        <EmailModal 
          person={selectedPerson} 
          onClose={() => setShowEmailModal(false)} 
        />
      )}

      {/* INTERVIEW ANSWERS MODAL */}
      {showInterviewModal && selectedPerson && (
        <InterviewModal 
          person={selectedPerson}
          onClose={() => setShowInterviewModal(false)}
        />
      )}
    </div>
  );
}
