import React from 'react';
import { User } from 'lucide-react';


export default function ProfileTab({ profile, setProfile }) {

 const handleSaveProfile = () => {
    alert('Profile saved successfully!');
    // Add API call here to save profile to backend
  };
return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <User size={24} /> Profile Management
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({...profile, name: e.target.value})}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({...profile, email: e.target.value})}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="tel"
            value={profile.phone}
            onChange={(e) => setProfile({...profile, phone: e.target.value})}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Skills</label>
          <input
            type="text"
            value={profile.skills}
            onChange={(e) => setProfile({...profile, skills: e.target.value})}
            placeholder="e.g., React, Node.js, JavaScript"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Education</label>
          <input
            type="text"
            value={profile.education}
            onChange={(e) => setProfile({...profile, education: e.target.value})}
            placeholder="e.g., BS Computer Science"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Experience</label>
          <input
            type="text"
            value={profile.experience}
            onChange={(e) => setProfile({...profile, experience: e.target.value})}
            placeholder="e.g., 2 years"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Upload CV (PDF)</label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setProfile({...profile, cv: e.target.files[0]})}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {profile.cv && (
            <p className="text-sm text-green-600 mt-1">✓ {profile.cv.name}</p>
          )}
        </div>
        
        <button 
          onClick={handleSaveProfile}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Save Profile
        </button>
        
      </div>
      
    </div>
  );

}