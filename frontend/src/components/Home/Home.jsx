// Home.jsx
import { useState } from "react";

import Navbar from "./Navbar.jsx";
import Hero from "./Hero.jsx";
import JobGrid from "./JobGrid.jsx";
import LargeBanner from "./LargeBanner.jsx";
import Footer from "./Footer.jsx";

// AUTH POPUPS
import Register from "./AuthForm/Register";
import Login from "./AuthForm/Login";
import Admin from "./AuthForm/Admin";

// DASHBOARDS
import JobSeekerDashboard from "../JobSeeker/JobSeekerDashboard.jsx";
//import EmployerDashboard from "../Employer/EmployerDashboard.jsx";

export default function Home() {
  const [activeForm, setActiveForm] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem("token");
    setUserRole(null);
  };

  if (userRole === "jobseeker") {
    return <JobSeekerDashboard onLogout={handleLogout} />;
  }

  if (userRole === "employer") {
    return <EmployerDashboard onLogout={handleLogout} />;
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar onAuthClick={setActiveForm} />
      <Hero />
      {/* POPUP FORMS */}
      {activeForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          {activeForm === "register" && (
            <Register
              onBack={() => setActiveForm(null)}
              onRegistrationSuccess={(role) => {
                setUserRole(role);
                setActiveForm(null);
              }}
            />
          )}
          {activeForm === "login" && (
            <Login
              onBack={() => setActiveForm(null)}
              onCreateNew={() => setActiveForm("register")}
              onLoginSuccess={(role) => {
                setUserRole(role);
                setActiveForm(null);
              }}
            />
          )}
          {activeForm === "admin" && (
            <Admin onBack={() => setActiveForm(null)} />
          )}
        </div>
      )}
      {/* JOB LISTING */}
      <JobGrid
        onApply={() => {
          setActiveForm("register");
        }}
      />
      <LargeBanner />
      <Footer />
    </main>
  );
}
