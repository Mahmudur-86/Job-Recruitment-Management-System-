import React, { useState } from 'react';
import { User, Briefcase, FileText, Bell, GraduationCap, Search, LogOut } from 'lucide-react';

import ProfileTab from './ProfileTab';
import BrowseJobsTab from './BrowseJobsTab';
import ApplicationsTab from './ApplicationsTab';
import NotificationsTab from './NotificationsTab';
import InternTab from './InternTab';
import InterviewModal from './InterviewModal';

export default function JobSeekerDashboard({ onLogout }) {

  const [profile, setProfile] = useState({});
  const [activeTab, setActiveTab] = useState("profile");   // DEFAULT = PROFILE

  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [internRequests, setInternRequests] = useState([]);

  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  // CHECK IF PROFILE COMPLETE
  const isProfileComplete = () => {
    return profile.name && profile.email && profile.phone;
  };

  // SAFE TAB SWITCHER
  const handleTabChange = (tab) => {
    if (tab !== "profile" && !isProfileComplete()) {
      alert("Thank you for completing the registration and it will be verified by admin.Please Logout. About twenty seconds later you can Login and then you will be able to write profile,but it is important for completing the all profile necessary information and save them.Otherwise, you can't access other features.");
      setActiveTab("profile");
      return;
    }
    setActiveTab(tab);
  };

  const handleApplyNow = (job) => {
    if (!isProfileComplete()) {
      alert("Please complete your profile first.");
      setActiveTab("profile");
      return;
    }

    setSelectedJob(job);
    setShowInterviewModal(true);
  };

  const handleApplicationSubmit = (applicationData) => {
    setApplications([...applications, applicationData]);

    const newNotification = {
      id: notifications.length + 1,
      message: `${applicationData.company} is reviewing your application for ${applicationData.jobTitle}`,
      date: new Date().toLocaleDateString(),
      type: "info",
    };

    setNotifications([newNotification, ...notifications]);
    setShowInterviewModal(false);
    setActiveTab("applications");
  };

  const handleInternSubmit = (internData) => {
    setInternRequests([...internRequests, internData]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="bg-blue-600 text-white p-6 rounded-lg shadow-lg mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Job Seeker Dashboard</h1>
            <p className="mt-2">Welcome, {profile.name || "User"}!</p>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-2 hover:bg-green-600 px-4 py-2 rounded transition duration-200 shadow-md"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>

        {/* TABS */}
        <div className="flex gap-2 mb-6 flex-wrap">

          <button
            onClick={() => handleTabChange("profile")}
            className={`px-4 py-2 rounded flex items-center gap-2 ${
              activeTab === "profile" ? "bg-blue-600 text-white" : "bg-white"
            }`}
          >
            <User size={18} /> Profile
          </button>

          <button
            onClick={() => handleTabChange("browse")}
            className={`px-4 py-2 rounded flex items-center gap-2 ${
              activeTab === "browse" ? "bg-blue-600 text-white" : "bg-white"
            }`}
          >
            <Search size={18} /> Browse Jobs
          </button>

          <button
            onClick={() => handleTabChange("applications")}
            className={`px-4 py-2 rounded flex items-center gap-2 ${
              activeTab === "applications" ? "bg-blue-600 text-white" : "bg-white"
            }`}
          >
            <FileText size={18} /> Applications
          </button>

          <button
            onClick={() => handleTabChange("notifications")}
            className={`px-4 py-2 rounded flex items-center gap-2 ${
              activeTab === "notifications" ? "bg-blue-600 text-white" : "bg-white"
            }`}
          >
            <Bell size={18} /> Notifications
            {notifications.length > 0 && (
              <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                {notifications.length}
              </span>
            )}
          </button>

          <button
            onClick={() => handleTabChange("intern")}
            className={`px-4 py-2 rounded flex items-center gap-2 ${
              activeTab === "intern" ? "bg-blue-600 text-white" : "bg-white"
            }`}
          >
            <GraduationCap size={18} /> Student Intern
          </button>
        </div>

        {/* TAB CONTENT */}
        {activeTab === "profile" && (
          <ProfileTab profile={profile} setProfile={setProfile} />
        )}

        {activeTab === "browse" && (
          <BrowseJobsTab onApplyNow={handleApplyNow} />
        )}

        {activeTab === "applications" && (
          <ApplicationsTab applications={applications} />
        )}

        {activeTab === "notifications" && (
          <NotificationsTab notifications={notifications} />
        )}

        {activeTab === "intern" && (
          <InternTab internRequests={internRequests} onSubmit={handleInternSubmit} />
        )}
      </div>

      {/* INTERVIEW MODAL */}
      {showInterviewModal && (
        <InterviewModal
          job={selectedJob}
          profile={profile}
          onClose={() => setShowInterviewModal(false)}
          onSubmit={handleApplicationSubmit}
          applicationId={applications.length + 1}
        />
      )}
    </div>
  );
}
