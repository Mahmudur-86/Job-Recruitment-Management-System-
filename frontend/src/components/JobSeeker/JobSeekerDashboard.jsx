import React, { useEffect, useMemo, useState } from "react";
import { User, Bell, GraduationCap, Search, LogOut } from "lucide-react";
import axios from "axios";

import ProfileTab from "./ProfileTab";
import BrowseJobsTab from "./BrowseJobsTab";
import InternTab from "./InternTab";
import NotificationsTab from "./NotificationsTab";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function JobSeekerDashboard({ onLogout }) {
  const token = useMemo(() => localStorage.getItem("token"), []);

  const [profile, setProfile] = useState({});
  const [activeTab, setActiveTab] = useState("profile");

  //  notifications state
  const [unreadCount, setUnreadCount] = useState(0);

  // keep your intern state
  const [internRequests, setInternRequests] = useState([]);

  const isProfileComplete = () => profile.name && profile.email && profile.phone;

  //  Load unread notifications count
  const loadUnreadCount = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/api/notifications/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUnreadCount(data.unreadCount || 0);
    } catch  {
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
      alert(
        "Thank you for completing the registration and it will be verified by admin.Please Logout. About ten seconds later you can Login again  and then you will be able to write profile,but it is important that you have to complete the all necessary profile information and save them.Otherwise, you can't access other features."
      );
      setActiveTab("profile");
      return;
    }

    setActiveTab(tab);

    //  when user opens notifications tab, refresh unread count
    if (tab === "notifications") {
      loadUnreadCount();
    }
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

            {/*  Unread badge */}
            {unreadCount > 0 && (
              <span className="ml-2 text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">
                {unreadCount}
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

        {activeTab === "browse" && <BrowseJobsTab profile={profile} />}

        {/*   NotificationsTab should fetch from backend by itself */}
        {activeTab === "notifications" && (
          <NotificationsTab onUpdateUnread={loadUnreadCount} />
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
