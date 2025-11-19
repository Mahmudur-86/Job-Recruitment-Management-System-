import React from "react";
import { User, FileText, Download } from "lucide-react";

export default function ProfileTab({ profile, setProfile }) {
  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // PDF Upload Handler
  const handleCvChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setProfile((prev) => ({
        ...prev,
        cvName: file.name,
        cvFile: file, // Later will be sent to backend via FormData
      }));
    } else {
      alert("Only PDF file allowed.");
    }
  };

  const handleSave = () => {
    alert("Profile saved! (Backend API will be added next)");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <User size={24} /> Profile Management
      </h2>

      <div className="space-y-8">
        {/* ---------------- BASIC INFORMATION ---------------- */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Basic Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* NAME */}
            <div>
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                value={profile.name || ""}
                onChange={handleChange("name")}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter your full name"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={profile.email || ""}
                onChange={handleChange("email")}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter your email"
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                value={profile.phone || ""}
                onChange={handleChange("phone")}
                className="w-full border rounded px-3 py-2"
                placeholder="+8801XXXXXXXXX"
              />
            </div>

            {/* ADDRESS */}
            <div>
              <label className="text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                value={profile.address || ""}
                onChange={handleChange("address")}
                className="w-full border rounded px-3 py-2"
                placeholder="City, Country"
              />
            </div>
          </div>
        </section>

        {/* ---------------- PERSONAL DETAILS ---------------- */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Personal Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* AGE */}
            <div>
              <label className="text-sm font-medium text-gray-700">Age</label>
              <input
                type="number"
                value={profile.age || ""}
                onChange={handleChange("age")}
                className="w-full border rounded px-3 py-2"
                placeholder="22"
              />
            </div>

            {/* GENDER */}
            <div>
              <label className="text-sm font-medium text-gray-700">Gender</label>
              <select
                value={profile.gender || ""}
                onChange={handleChange("gender")}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* JOB INTEREST */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Job Interest
              </label>
              <input
                type="text"
                value={profile.jobInterest || ""}
                onChange={handleChange("jobInterest")}
                className="w-full border rounded px-3 py-2"
                placeholder="Frontend, Backend, DevOps..."
              />
            </div>
          </div>

          {/* BIO */}
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700">Bio</label>
            <textarea
              value={profile.bio || ""}
              onChange={handleChange("bio")}
              rows={3}
              className="w-full border rounded px-3 py-2"
              placeholder="Write something about yourself..."
            />
          </div>
        </section>

        {/* ---------------- SKILLS / EDUCATION / EXPERIENCE ---------------- */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Skills & Background
          </h3>

          <div className="space-y-4">
            <textarea
              value={profile.skills || ""}
              onChange={handleChange("skills")}
              rows={2}
              className="w-full border rounded px-3 py-2"
              placeholder="Skills: React, Node.js, Tailwind..."
            />

            <textarea
              value={profile.education || ""}
              onChange={handleChange("education")}
              rows={2}
              className="w-full border rounded px-3 py-2"
              placeholder="Education details..."
            />

            <textarea
              value={profile.experience || ""}
              onChange={handleChange("experience")}
              rows={2}
              className="w-full border rounded px-3 py-2"
              placeholder="Work/Intern experience..."
            />
          </div>
        </section>

        {/* ---------------- LINKS ---------------- */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Online Presence
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="url"
              value={profile.portfolio || ""}
              onChange={handleChange("portfolio")}
              className="w-full border rounded px-3 py-2"
              placeholder="Portfolio URL"
            />

            <input
              type="url"
              value={profile.github || ""}
              onChange={handleChange("github")}
              className="w-full border rounded px-3 py-2"
              placeholder="GitHub URL"
            />

            <input
              type="url"
              value={profile.linkedin || ""}
              onChange={handleChange("linkedin")}
              className="w-full border rounded px-3 py-2"
              placeholder="LinkedIn URL"
            />
          </div>
        </section>

        {/* ---------------- CV UPLOAD ---------------- */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">CV / Resume</h3>

          <div className="flex items-center gap-4">
            {/* Upload Button */}
            <label
              htmlFor="cvUpload"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700"
            >
              <FileText size={18} />
              {profile.cvName ? "Change CV" : "Upload CV (PDF)"}
            </label>

            <input
              id="cvUpload"
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleCvChange}
            />

            {/* Show Filename */}
            {profile.cvName && (
              <span className="text-sm font-medium text-gray-700">
                {profile.cvName}
              </span>
            )}

            {/* Download button (dummy for now) */}
            {profile.cvName && (
              <button className="flex items-center gap-1 text-blue-600 hover:underline text-sm">
                <Download size={18} />
                Download
              </button>
            )}
          </div>
        </section>

        {/* ---------------- SAVE BUTTON ---------------- */}
        <div className="pt-4">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-800"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}
