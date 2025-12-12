import React, { useState } from "react";
import { User, Bell, GraduationCap, Search, LogOut } from "lucide-react";

import ProfileTab from "./ProfileTab";
import BrowseJobsTab from "./BrowseJobsTab";
import InternTab from "./InternTab";
import NotificationsTab from "./NotificationsTab";

export default function JobSeekerDashboard({ onLogout }) {
  const [profile, setProfile] = useState({});
  const [activeTab, setActiveTab] = useState("profile");

  const notificationsEnabled = false;
  const notifications = [];

  const [internRequests, setInternRequests] = useState([]);

  const isProfileComplete = () => profile.name && profile.email && profile.phone;

  const handleTabChange = (tab) => {
    if (tab !== "profile" && !isProfileComplete()) {
      alert(
        "Thank you for completing the registration and it will be verified by admin.Please Logout. About ten seconds later you can Login again  and then you will be able to write profile,but it is important that you have to complete the all necessary profile information and save them.Otherwise, you can't access other features."
      );
      setActiveTab("profile");
      return;
    }
    setActiveTab(tab);
  };

  const handleInternSubmit = (internData) => {
    setInternRequests([...internRequests, internData]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-blue-600 text-white p-6 rounded-lg shadow-lg mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Job Seeker Dashboard</h1>
            <p className="mt-2">Welcome, {profile.name || "User"}.</p>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-2 hover:bg-green-600 px-4 py-2 rounded transition duration-200 shadow-md"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>

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
            onClick={() => handleTabChange("notifications")}
            className={`px-4 py-2 rounded flex items-center gap-2 ${
              activeTab === "notifications"
                ? "bg-blue-600 text-white"
                : "bg-white"
            }`}
          >
            <Bell size={18} /> Notifications
            {!notificationsEnabled && (
              <span >
               
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

        {activeTab === "profile" && (
          <ProfileTab profile={profile} setProfile={setProfile} />
        )}

        {activeTab === "browse" && (
          <BrowseJobsTab profile={profile} />
        )}

        {activeTab === "notifications" && (
          <NotificationsTab notifications={notifications} />
        )}

        {activeTab === "intern" && (
          <InternTab
            internRequests={internRequests}
            onSubmit={handleInternSubmit}
          />
        )}
      </div>
    </div>
  );
}
