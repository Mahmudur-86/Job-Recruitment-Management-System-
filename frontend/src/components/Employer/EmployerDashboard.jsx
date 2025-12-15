import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

import CompanyProfile from "./CompanyProfile";
import PostJob from "./PostJob";
import AllJobs from "./AllJobs";
import ViewApplications from "./ViewApplications";
import StudentInternList from "./StudentInternList";
import StudentInternshipAlert from "./StudentInternshipAlert";
import EmailModal from "./EmailModal";
import AddMCQs from "./AddMCQs";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function EmployerDashboard({ onLogout }) {
  const [currentPage, setCurrentPage] = useState("dashboard");

  //  Use token OR adminToken 
  const token = useMemo(
    () => localStorage.getItem("token") || localStorage.getItem("adminToken"),
    []
  );

  //  Applications fetched from backend
  const [applications, setApplications] = useState([]);

  // Jobs posted by employer
  const [jobs, setJobs] = useState([]);

  // Students (dummy ) 
  const [students] = useState([
    {
      id: 1,
      studentName: "Md.Mahmudur Rahman",
      studentId: "22103295",
      university: "IUBAT",
      batch: "Fall - 25",
      department: "CSE",
      email: "hrid3740@gmail.com",
      cvName: "Mahmudur_CV.pdf",
      cvUrl: "/assets/cvfile/CV.pdf",
      status: "pending",
      submittedDate: "12/14/2025",
    },
  ]);

  // Email modal
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);

  // MCQ job selection
  const [selectedJob, setSelectedJob] = useState(null);

  // Profile state
  const [profile, setProfile] = useState({
    EmployerName: "",
    CompanyName: "",
    email: "",
    address: "",
    phone: "",
    website: "",
    companyLogo: "",
    companyLogoFile: null,
  });

  // Internship alert
  const [alert, setAlert] = useState({
    companyName: "",
    department: "",
    university: "",
    role: "",
    duration: "",
    description: "",
    websiteName: "",
    universityMail: "",
    position: "",
    contact: "",
  });

  const [isAlertActive, setIsAlertActive] = useState(false);

  //  Fetch Applications (Employer endpoint, NOT admin)
  const fetchApplications = async () => {
    try {
      const { data } = await axios.get(
        `${API_BASE}/api/interviews/employer/applications`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplications(data.applications || []);
    } catch (err) {
      console.error("FETCH APPLICATIONS ERROR:", err);
      setApplications([]);
    }
  };

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line
  }, []);

  // Dashboard UI
  const dashboardFeatures = [
    { title: "Company Profile", page: "profile" },
    { title: "Post Job", page: "postjob" },
    { title: "All Jobs", page: "alljobs" },
    { title: "View Applications", page: "applications" },
    { title: "Student Intern List", page: "students" },
    { title: "Internship Alerts", page: "alerts" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* NAVBAR */}
      <nav className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Employer Dashboard</h1>

          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-lg bg-white text-blue-700 font-semibold hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="p-4">
        {/* DASHBOARD PAGE */}
        {currentPage === "dashboard" && (
          <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dashboardFeatures.map((feature, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(feature.page)}
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition text-left"
                  >
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentPage === "profile" && (
          <CompanyProfile
            setCurrentPage={setCurrentPage}
            profile={profile}
            setProfile={setProfile}
          />
        )}

        {currentPage === "postjob" && (
          <PostJob setCurrentPage={setCurrentPage} jobs={jobs} setJobs={setJobs} />
        )}

        {currentPage === "alljobs" && (
          <AllJobs
            setCurrentPage={setCurrentPage}
            jobs={jobs}
            setJobs={setJobs}
            setSelectedJob={setSelectedJob}
          />
        )}

        {currentPage === "applications" && (
          <ViewApplications
            setCurrentPage={setCurrentPage}
            applications={applications}
            showEmailModal={showEmailModal}
            setShowEmailModal={setShowEmailModal}
            selectedPerson={selectedPerson}
            setSelectedPerson={setSelectedPerson}
            //  refresh button support 
            refreshApplications={fetchApplications}
          />
        )}

        {currentPage === "students" && (
          <StudentInternList setCurrentPage={setCurrentPage} students={students} />
        )}

        {currentPage === "alerts" && (
          <StudentInternshipAlert
            setCurrentPage={setCurrentPage}
            alert={alert}
            setAlert={setAlert}
            isAlertActive={isAlertActive}
            setIsAlertActive={setIsAlertActive}
          />
        )}

        {showEmailModal && selectedPerson && (
          <EmailModal person={selectedPerson} onClose={() => setShowEmailModal(false)} />
        )}

        {currentPage === "mcq" && selectedJob && (
          <AddMCQs
            setCurrentPage={setCurrentPage}
            jobs={jobs}
            setJobs={setJobs}
            selectedJob={selectedJob}
          />
        )}
      </div>
    </div>
  );
}
