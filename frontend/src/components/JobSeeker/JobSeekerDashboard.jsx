import React, { useState } from 'react';
import { User, Briefcase, FileText, Bell, GraduationCap, Search, MapPin, Building, LogOut } from 'lucide-react';
import ProfileTab from './ProfileTab';
import BrowseJobsTab from './BrowseJobsTab';
import ApplicationsTab from './ApplicationsTab';
import NotificationsTab from './NotificationsTab';
import InternTab from './InternTab';
import InterviewModal from './InterviewModal';

export default function JobSeekerDashboard() {
  const [activeTab, setActiveTab] = useState('browse');
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    skills: 'React, Node.js, JavaScript',
    education: 'BS Computer Science',
    experience: '2 years',
    cv: null
  });
  
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [internRequests, setInternRequests] = useState([]);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const handleApplyNow = (job) => {
    setSelectedJob(job);
    setShowInterviewModal(true);
  };

  const handleApplicationSubmit = (applicationData) => {
    setApplications([...applications, applicationData]);
    
    if (applicationData.status === 'pending') {
      const newNotification = {
        id: notifications.length + 1,
        message: `${applicationData.company} is reviewing your application for ${applicationData.jobTitle}`,
        date: new Date().toLocaleDateString(),
        type: 'info'
      };
      setNotifications([newNotification, ...notifications]);
    }
    
    setShowInterviewModal(false);
    setActiveTab('applications');
  };

  const handleInternSubmit = (internData) => {
    setInternRequests([...internRequests, internData]);
  };


  const handleLogout = () => {
  const confirmLogout = window.confirm('Are you sure you want to logout?');
  if (confirmLogout) {
    alert('Logged out successfully!');
    // Add actual logout logic here (e.g., clearing auth tokens, redirecting to login page)
  }
};

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6 rounded-lg shadow-lg mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Job Seeker Dashboard</h1>
            <p className="mt-2">Welcome, {profile.name}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition duration-200 shadow-md"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded flex items-center gap-2 ${
              activeTab === 'profile' ? 'bg-blue-600 text-white' : 'bg-white'
            }`}
          >
            <User size={18} /> Profile
          </button>
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2 rounded flex items-center gap-2 ${
              activeTab === 'browse' ? 'bg-blue-600 text-white' : 'bg-white'
            }`}
          >
            <Search size={18} /> Browse Jobs
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-2 rounded flex items-center gap-2 ${
              activeTab === 'applications' ? 'bg-blue-600 text-white' : 'bg-white'
            }`}
          >
            <FileText size={18} /> Applications
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2 rounded flex items-center gap-2 ${
              activeTab === 'notifications' ? 'bg-blue-600 text-white' : 'bg-white'
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
            onClick={() => setActiveTab('intern')}
            className={`px-4 py-2 rounded flex items-center gap-2 ${
              activeTab === 'intern' ? 'bg-blue-600 text-white' : 'bg-white'
            }`}
          >
            <GraduationCap size={18} /> Student Intern
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <ProfileTab profile={profile} setProfile={setProfile} />
        )}
        {activeTab === 'browse' && (
          <BrowseJobsTab onApplyNow={handleApplyNow} />
        )}
        {activeTab === 'applications' && (
          <ApplicationsTab applications={applications} />
        )}
        {activeTab === 'notifications' && (
          <NotificationsTab notifications={notifications} />
        )}
        {activeTab === 'intern' && (
          <InternTab 
            internRequests={internRequests} 
            onSubmit={handleInternSubmit} 
          />
        )}
      </div>

      {/* Interview Modal */}
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