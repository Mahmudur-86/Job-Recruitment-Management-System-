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
import EmployerDashboard from "../Employer/EmployerDashboard.jsx";

export default function Home() {
  const [activeForm, setActiveForm] = useState(null);
  const [userRole, setUserRole] = useState(null);

  //  LOGOUT (from any dashboard)
  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.error(e);
    }

    // 🔥 IMPORTANT: REMOVE TOKEN FROM BROWSER
    localStorage.removeItem("token");

    // BACK TO HOME PAGE
    setUserRole(null);
  };

  //  ROLE SWITCH → Dashboard Open
  if (userRole === "jobseeker") {
    return <JobSeekerDashboard onLogout={handleLogout} />;
  }

  if (userRole === "employer") {
    return <EmployerDashboard onLogout={handleLogout} />;
  }

  // -----------------------------
  //     PUBLIC HOME PAGE
  // -----------------------------

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar onAuthClick={setActiveForm} />
      <Hero />

      {/* POPUP FORMS */}
      {activeForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">

          {/* REGISTER FORM */}
          {activeForm === "register" && (
            <Register
              onBack={() => setActiveForm(null)}

              //  After Register → Auto Login to Dashboard
              onRegistrationSuccess={(role) => {
                setUserRole(role);   // open dashboard
                setActiveForm(null); // close popup
              }}
            />
          )}

          {/* LOGIN FORM */}
          {activeForm === "login" && (
            <Login
              onBack={() => setActiveForm(null)}
              onCreateNew={() => setActiveForm("register")}

              //  Login → Go to correct dashboard
              onLoginSuccess={(role) => {
                setUserRole(role);
                setActiveForm(null);
              }}
            />
          )}

          {/* ADMIN LOGIN */}
          {activeForm === "admin" && (
            <Admin onBack={() => setActiveForm(null)} />
          )}
        </div>
      )}

      <JobGrid />
      <LargeBanner />
      <Footer />
    </main>
  );
}
