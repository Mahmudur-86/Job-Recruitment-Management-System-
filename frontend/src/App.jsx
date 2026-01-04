import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/Home/Home.jsx";

// Admin imports
import Sidebar from "./components/Admin/layout/Sidebar.jsx";
import Header from "./components/Admin/layout/Header.jsx";
import Dashboard from "./components/Admin/Pages/Dashboard.jsx";
import ManageUsers from "./components/Admin/Pages/ManageUsers.jsx";
import ManageJobs from "./components/Admin/Pages/ManageJobs.jsx";
import ManageApplicants from "./components/Admin/Pages/ManageApplicants.jsx";
import RecruitmentLetter from "./components/Admin/Pages/RecruitmentLetter.jsx";

import ViewInterviewAnswers from "./components/Admin/Pages/ViewInterviewAnswers.jsx";

import MonthlyReport from "./components/Admin/Pages/MonthlyReport.jsx";

import JobSeekerDashboard from "./components/JobSeeker/JobSeekerDashboard.jsx";





import PrivateRoute from "./components/Auth/PrivateRoute.jsx";


function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Header />
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>

        {/* Public Home */}
        <Route path="/" element={<Home />} />

        {/* Admin protected */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <PrivateRoute>
              <AdminLayout>
                <ManageUsers />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/jobs"
          element={
            <PrivateRoute>
              <AdminLayout>
                <ManageJobs />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/applicants"
          element={
            <PrivateRoute>
              <AdminLayout>
                <ManageApplicants />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        

  <Route
          path="/admin/interview-answers"
          element={
            <PrivateRoute>
              <AdminLayout>
                <ViewInterviewAnswers />
              </AdminLayout>
            </PrivateRoute>
          }
        />



   <Route
          path="/admin/monthly-report"
          element={
            <PrivateRoute>
              <AdminLayout>
                <MonthlyReport />
              </AdminLayout>
            </PrivateRoute>
          }
        />

<Route
  path="/admin/recruitment-letter"
  element={
    <PrivateRoute>
      <AdminLayout>
        <RecruitmentLetter />
      </AdminLayout>
    </PrivateRoute>
  }
/>






        {/* jobseeker protected */}
        <Route
          path="/jobseeker"
          element={
            <PrivateRoute>
              <JobSeekerDashboard />
            </PrivateRoute>
          }
        />




      </Routes>
    </Router>
  );
}
