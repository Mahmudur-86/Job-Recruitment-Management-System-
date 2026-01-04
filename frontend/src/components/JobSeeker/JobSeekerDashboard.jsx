import React, { useEffect, useMemo, useState } from "react";
import { User, Bell,  Search, LogOut, FileText } from "lucide-react";
import axios from "axios";

import ProfileTab from "./ProfileTab";
import BrowseJobsTab from "./BrowseJobsTab";

import NotificationsTab from "./NotificationsTab";

import ViewRecruitmentLetter from "./ViewRecruitmentLetter";


const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function JobSeekerDashboard({ onLogout }) {
  const token = useMemo(() => localStorage.getItem("token"), []);

  const [profile, setProfile] = useState({});
  const [activeTab, setActiveTab] = useState("profile");

  //  notifications state
  const [unreadCount, setUnreadCount] = useState(0);

  
 

  //  popup state 
  const [showPopup, setShowPopup] = useState(false);
  const popupMsg =
    "Please complete your profile first to access other features.";

  const isProfileComplete = () => profile.name && profile.email && profile.phone;

  //  Load unread notifications count
  const loadUnreadCount = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/api/notifications/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUnreadCount(data.unreadCount || 0);
    } catch {
      // if token missing / API fail, just show 0
      setUnreadCount(0);
    }
  };

  //  on first render load unread count
  useEffect(() => {
    loadUnreadCount();
    // eslint-disable-next-line
  }, []);

  const handleTabChange = (tab) => {
    if (tab !== "profile" && !isProfileComplete()) {
      //  popup instead of alert
      setShowPopup(true);

      setActiveTab("profile");
      return;
    }

    setActiveTab(tab);

    //  when user opens notifications tab, refresh unread count
    if (tab === "notifications") {
      loadUnreadCount();
    }
  };

  

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/*  POPUP MODAL (alert replacement) */}
        {showPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* overlay */}
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setShowPopup(false)}
            />
            {/* modal */}
            <div className="relative w-full max-w-lg rounded-xl bg-white shadow-2xl border border-gray-200 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Profile Required
                  </h3>
                  <p className="mt-2 text-sm text-gray-700 leading-relaxed p-1">
                    {popupMsg}
                  </p>
                </div>

              
              </div>

              <div className="mt-5 flex items-center justify-end gap-2">
                <button
                  onClick={() => setShowPopup(false)}
                  className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

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

            {/*  Unread badge */}
            {unreadCount > 0 && (
              <span className="ml-2 text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">
                {unreadCount}
              </span>
            )}
          </button>

<button
  onClick={() => handleTabChange("recruitment")}
  className={`px-4 py-2 rounded flex items-center gap-2 ${
    activeTab === "recruitment" ? "bg-blue-600 text-white" : "bg-white"
  }`}
>
  <FileText size={18} /> View Recruitment Letter
</button>




         
        </div>

        {activeTab === "profile" && (
          <ProfileTab profile={profile} setProfile={setProfile} />
        )}

        {activeTab === "browse" && <BrowseJobsTab profile={profile} />}

        {/*   NotificationsTab should fetch from backend by itself */}
        {activeTab === "notifications" && (
          <NotificationsTab onUpdateUnread={loadUnreadCount} />
        )}

      {activeTab === "recruitment" && <ViewRecruitmentLetter />}
      </div>
    </div>
  );
}
