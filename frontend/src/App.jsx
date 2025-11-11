import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/Home/Home.jsx";

//  Admin Dashboard imports
import Sidebar from "./components/Admin/layout/Sidebar.jsx";
import Header from "./components/Admin/layout/Header.jsx";
import Dashboard from "./components/Admin/Pages/Dashboard.jsx";
import ManageUsers from "./components/Admin/Pages/ManageUsers.jsx";
import ManageJobs from "./components/Admin/Pages/ManageJobs.jsx";
import ManageApplicants from "./components/Admin/Pages/ManageApplicants.jsx";
import InternshipAlerts from "./components/Admin/Pages/InternshipAlerts.jsx";

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
        {/*  Home Page */}
        <Route path="/" element={<Home />} />

        {/*  Admin Dashboard Pages */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminLayout>
              <ManageUsers />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/jobs"
          element={
            <AdminLayout>
              <ManageJobs />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/applicants"
          element={
            <AdminLayout>
              <ManageApplicants />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/internships"
          element={
            <AdminLayout>
              <InternshipAlerts />
            </AdminLayout>
          }
        />
      </Routes>
    </Router>
  );
}

