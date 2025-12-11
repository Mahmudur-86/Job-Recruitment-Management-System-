import React, { useEffect, useState } from "react";
import { User, FileText, Download, Pencil,  } from "lucide-react";

// API BASE HANDLER 
let API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_URL;

// If still missing, show error 
if (!API_BASE || API_BASE.trim() === "") {
  console.error(" API_BASE missing! Please set VITE_API_BASE in .env");
}

API_BASE = API_BASE.replace(/\/+$/, "");

export default function ProfileTab({ profile, setProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(true);  // State to manage view-only mode
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state

  //  NEW: local image state (only for frontend preview)
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);

  // Load profile
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !API_BASE) return;

    const loadProfile = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/profile/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 404) return;

        const data = await res.json();

        setProfile({
          ...data,
          cvName: data.cvUrl ? data.cvUrl.split("/").pop() : "",
          cvFile: undefined,
        });

        //  if backend later sends an image URL, show it
        if (data.profileImageUrl) {
          setProfileImagePreview(`${API_BASE}${data.profileImageUrl}`);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };

    loadProfile();
  }, [setProfile]);

  const handleChange = (field) => (e) => {
    if (!isEditing) return;
    setProfile((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleCvChange = (e) => {
    if (!isEditing) return;
    const file = e.target.files?.[0];

    if (file && file.type === "application/pdf") {
      setProfile((prev) => ({
        ...prev,
        cvFile: file,
        cvName: file.name,
      }));
    } else {
      alert("Only PDF files are allowed.");
    }
  };

  //   handle profile image upload (frontend preview only)
  const handleProfileImageChange = (e) => {
    if (!isEditing) return;

    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed.");
      return;
    }

    const previewURL = URL.createObjectURL(file);
    setProfileImageFile(file);
    setProfileImagePreview(previewURL);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token || !API_BASE) return;

    try {
      const formData = new FormData();

      const fields = [
        "name", "email", "phone", "address", "age", "gender",
        "jobInterest", "bio", "skills", "education",
        "experience", "portfolio", "github", "linkedin",
      ];

      fields.forEach((field) => {
        if (profile[field]) formData.append(field, profile[field]);
      });

      if (profile.cvFile) formData.append("cv", profile.cvFile);

      //  NEW: send profile image along with form (backend work you’ll do later)
      if (profileImageFile) {
        formData.append("profileImage", profileImageFile);
      }

      const res = await fetch(`${API_BASE}/api/profile`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) return;

      setProfile((prev) => ({
        ...prev,
        ...data.profile,
        cvName: data.profile.cvUrl
          ? data.profile.cvUrl.split("/").pop()
          : prev.cvName,
        cvFile: undefined,
      }));

      //  NEW: if backend returns image URL, update preview
      if (data.profile && data.profile.profileImageUrl) {
        setProfileImagePreview(`${API_BASE}${data.profile.profileImageUrl}`);
        setProfileImageFile(null);
      }

      setIsEditing(false);
      setIsViewing(true);  // Make sure we return to viewing mode after saving
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

 { /* const toggleViewMode = () => {
    setIsViewing(!isViewing);  // Toggle between view-only and edit modes
    setIsEditing(false); // Make sure editing is turned off when switching to view mode
    setIsModalOpen(false); // Close modal when switching back to edit mode
  }; */ }

  const openModal = () => setIsModalOpen(true); // Open modal
  const closeModal = () => setIsModalOpen(false); // Close modal

  const handleBackClick = () => {
    // Functionality to navigate back to the first page after clicking 'Back'
    setIsViewing(true);
    setIsEditing(false);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <User size={24} /> Profile Management
        </h2>

        <div className="flex gap-3">
          {/* View/Edit Toggle Button */}
          <button
            onClick={() => {
              setIsEditing(true);
              setIsViewing(false);
            }}
            className={`flex items-center gap-2 ${isViewing ? 'bg-gray-700' : 'bg-blue-600'} text-white px-4 py-2 rounded-lg shadow-md transition duration-300`}
          >
            <Pencil size={18} /> Edit
          </button>

          {/* View Profile Button */}
          <button
            onClick={openModal} // Open the modal to view profile
            className={`flex items-center gap-2 ${isViewing ? 'bg-blue-600' : 'bg-gray-700'} text-white px-4 py-2 rounded-lg shadow-md transition duration-300`}
          >
            {isViewing ? "View Profile" : "View Profile"}
          </button>

          {/* Back Button */}
          {!isViewing && (
            <button
              onClick={handleBackClick} // Go back to the main page
              className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg shadow-md transition duration-300"
            >
               Back
            </button>
          )}
        </div>
      </div>

      {/*  NEW: PROFILE IMAGE SECTION (page top) */}
      <div className="flex justify-center mb-6">
        <label className="relative cursor-pointer group">
          <img
            src={
              profileImagePreview 
              
            }
            alt=""
            className="w-30 h-38 rounded-full border object-cover shadow-md"
          />

          {isEditing && (
            <>
              <div className="absolute -inset-8 bg-black/50 rounded-full flex justify-center items-center opacity-0 group-hover:opacity-100 transition duration-300">
                <span className="text-white text-xs">Change Photo</span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
                className="hidden"
              />
            </>
          )}
        </label>
      </div>

      <div className="space-y-6">
        {/* BASIC INFO */}
        <section>
          <h3 className="font-semibold text-gray-800 mb-2">Basic Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isViewing ? (
              <>
                <p className="text-gray-700"><strong>Name: </strong>{profile.name || ""}</p>
                <p className="text-gray-700"><strong>Email: </strong>{profile.email || ""}</p>
                <p className="text-gray-700"><strong>Phone: </strong>{profile.phone || ""}</p>
                <p className="text-gray-700"><strong>Address: </strong>{profile.address || ""}</p>
              </>
            ) : (
              <>
              <label className="text-gray-700 font-semibold">Name:</label>
                <input disabled={!isEditing} type="text" value={profile.name || ""} onChange={handleChange("name")} className="border px-4 py-2 rounded-lg w-full" />
                <label className="text-gray-700 font-semibold">Email:</label>
                <input disabled={!isEditing} type="email" value={profile.email || ""} onChange={handleChange("email")} className="border px-4 py-2 rounded-lg w-full" />
                <label className="text-gray-700 font-semibold">Phone:</label>
                <input disabled={!isEditing} type="text" value={profile.phone || ""} onChange={handleChange("phone")} className="border px-4 py-2 rounded-lg w-full" />
                <label className="text-gray-700 font-semibold">Address:</label>
                <input disabled={!isEditing} type="text" value={profile.address || ""} onChange={handleChange("address")} className="border px-4 py-2 rounded-lg w-full" />
              </>
            )}
          </div>
        </section>

        {/* PERSONAL DETAILS */}
        <section>
          <h3 className="font-semibold text-gray-800 mb-2">Personal Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isViewing ? (
              <>
              
                <p className="text-gray-700"><strong>Age: </strong>{profile.age || ""}</p>
                <p className="text-gray-700"><strong>Gender: </strong>{profile.gender || ""}</p>
                <p className="text-gray-700"><strong>Job Interest: </strong>{profile.jobInterest || ""}</p>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    <label className="text-gray-700 font-semibold">Age:</label>
    <input 
      disabled={!isEditing} 
      type="number" 
      value={profile.age || ""} 
      onChange={handleChange("age")} 
      className="border px-4 py-2 rounded-lg w-full"
    />
  </div>

  <div>
    <label className="text-gray-700 font-semibold">Gender:</label>
    <select 
      disabled={!isEditing} 
      value={profile.gender || ""} 
      onChange={handleChange("gender")} 
      className="border px-4 py-2 rounded-lg w-full"
    >
      <option value="">Select gender</option>
      <option value="male">Male</option>
      <option value="female">Female</option>
      <option value="other">Other</option>
    </select>
  </div>

  <div className="col-span-2">
    <label className="text-gray-700 font-semibold">Job Interest:</label>
    <input 
      disabled={!isEditing} 
      type="text" 
      value={profile.jobInterest || ""} 
      onChange={handleChange("jobInterest")} 
      className="border px-4 py-2 rounded-lg w-full"
    />
  </div>
</div>
              </>
            )}
          </div>
        </section>
        {/* BIO */}
        <section>
          <h3 className="font-semibold text-gray-800 mb-2">Bio</h3>
          {isViewing ? (
            <p className="text-gray-700">{profile.bio || ""}</p>
          ) : (
            <textarea disabled={!isEditing} value={profile.bio || ""} onChange={handleChange("bio")} className="border px-4 py-2 rounded-lg w-full" rows={3} />
          )}
        </section>

        {/* LINKS */}
        <section>
          <h3 className="font-semibold text-gray-800 mb-2">Online Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isViewing ? (
              <>
              
                <p className="text-gray-700"><strong>Portfolio:</strong> {profile.portfolio || ""}</p>
                <p className="text-gray-700"><strong>GitHub:</strong> {profile.github || ""}</p>
                <p className="text-gray-700"><strong>LinkedIn:</strong> {profile.linkedin || ""}</p>
              </>
            ) : (
              <>
              
              
  <div className="w-full sm:w-1/2 lg:w-1/3">
    <label className="text-gray-700 font-semibold block mb-2">Portfolio:</label>
    <input 
      disabled={!isEditing} 
      type="url" 
      value={profile.portfolio || ""} 
      onChange={handleChange("portfolio")} 
      className="border px-4 py-2 rounded disabled:bg-gray-100 " 
      placeholder="Enter portfolio URL"
    />
  </div>

  <div className="w-full sm:w-1/2 lg:w-1/3">
    <label className="text-gray-700 font-semibold block mb-2">GitHub:</label>
    <input 
      disabled={!isEditing} 
      type="url" 
      value={profile.github || ""} 
      onChange={handleChange("github")} 
      className="border px-4 py-2 rounded disabled:bg-gray-100" 
      placeholder="Enter GitHub URL"
    />
  </div>

  <div className="w-full sm:w-1/2 lg:w-1/3">
    <label className="text-gray-700 font-semibold block mb-2">LinkedIn:</label>
    <input 
      disabled={!isEditing} 
      type="url" 
      value={profile.linkedin || ""} 
      onChange={handleChange("linkedin")} 
      className="border px-4 py-2 rounded disabled:bg-gray-100" 
      placeholder="Enter LinkedIn URL"
    />
  </div>



              </>
            )}
          </div>
        </section>
        {/* CV UPLOAD */}
        <section>
          <h3 className="font-semibold text-gray-800 mb-2">CV Upload</h3>
          {isEditing && (
            <label htmlFor="cvUpload" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer">
              <FileText size={20} /> Upload / Change CV
            </label>
          )}
          <input id="cvUpload" type="file" accept="application/pdf" className="hidden" onChange={handleCvChange} disabled={!isEditing} />
          {profile.cvName && <p className="text-gray-700">{profile.cvName}</p>}
          {profile.cvUrl && isViewing && (
            <a href={`${API_BASE}${profile.cvUrl}`} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
              <Download size={18} /> Download CV
            </a>
          )}
        </section>

        {/* Save Button in Editing Mode */}
        {isEditing && (
          <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-3 rounded-lg mt-6 w-full">
            Save Profile
          </button>
        )}
      </div>

      {/* Modal for Viewing Profile */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full">

            {/*  Show same profile image in modal */}
            <div className="flex justify-center mb-4">
              <img
                src={
                  profileImagePreview 
                  
                }
                alt=""
                className="w-30 h-38  rounded-full border object-cover shadow"
              />
            </div>

            <h3 className="font-semibold text-xl mb-4">Profile Details</h3>
            <div className="space-y-4">
              <p><strong>Name:</strong> {profile.name}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Phone:</strong> {profile.phone}</p>
              <p><strong>Address:</strong> {profile.address}</p>
<p><strong>Age:</strong>  {profile.age || ""}</p>
 <p><strong>Gender:</strong> {profile.gender || ""}</p>
              <p><strong>Job Interest:</strong> {profile.jobInterest || ""}</p>
              <p><strong>Bio:</strong> {profile.bio || ""}</p>
              <p><strong>Portfolio:</strong> {profile.portfolio}</p>
              <p><strong>GitHub:</strong> {profile.github}</p>
              <p><strong>LinkedIn:</strong> {profile.linkedin}</p>
             
              {profile.cvUrl && (
                <p><strong>CV:</strong> <a href={`${API_BASE}${profile.cvUrl}`} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">View CV</a></p>
              )}
              <button onClick={closeModal} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
