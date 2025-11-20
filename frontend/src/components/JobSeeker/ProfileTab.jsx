import React, { useEffect, useState } from "react";
import { User, FileText, Download, Pencil, X, Check } from "lucide-react";

// ===== SAFE API BASE HANDLER (NO HARDCODED URL) =====
let API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_URL;

// If still missing, show error (but do NOT fall back to localhost)
if (!API_BASE || API_BASE.trim() === "") {
  console.error(" API_BASE missing! Please set VITE_API_BASE in .env");
}

// Clean double slashes
API_BASE = API_BASE.replace(/\/+$/, "");

console.log("FINAL API_BASE =", API_BASE);

export default function ProfileTab({ profile, setProfile }) {
  const [isEditing, setIsEditing] = useState(false);

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

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <User size={24} /> Profile Management
        </h2>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded"
          >
            <Pencil size={18} /> Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded"
            >
              <X size={18} /> Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded"
            >
              <Check size={18} /> Save
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6">

        {/* BASIC INFO */}
        <section>
          <h3 className="font-semibold text-gray-800 mb-2">Basic Info</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input disabled={!isEditing} type="text" placeholder="Full Name"
              value={profile.name || ""} onChange={handleChange("name")}
              className="border px-3 py-2 rounded disabled:bg-gray-100" />

            <input disabled={!isEditing} type="email" placeholder="Email"
              value={profile.email || ""} onChange={handleChange("email")}
              className="border px-3 py-2 rounded disabled:bg-gray-100" />

            <input disabled={!isEditing} type="text" placeholder="Phone"
              value={profile.phone || ""} onChange={handleChange("phone")}
              className="border px-3 py-2 rounded disabled:bg-gray-100" />

            <input disabled={!isEditing} type="text" placeholder="Address"
              value={profile.address || ""} onChange={handleChange("address")}
              className="border px-3 py-2 rounded disabled:bg-gray-100" />
          </div>
        </section>

        {/* PERSONAL DETAILS */}
        <section>
          <h3 className="font-semibold">Personal Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input disabled={!isEditing} type="number" placeholder="Age"
              value={profile.age || ""} onChange={handleChange("age")}
              className="border px-3 py-2 rounded disabled:bg-gray-100" />

            <select disabled={!isEditing}
              value={profile.gender || ""} onChange={handleChange("gender")}
              className="border px-3 py-2 rounded disabled:bg-gray-100">
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            <input disabled={!isEditing} type="text" placeholder="Job Interest"
              value={profile.jobInterest || ""} onChange={handleChange("jobInterest")}
              className="border px-3 py-2 rounded disabled:bg-gray-100" />
          </div>
        </section>

        {/* BIO */}
        <textarea disabled={!isEditing} placeholder="Bio"
          value={profile.bio || ""} onChange={handleChange("bio")}
          className="border px-3 py-2 rounded w-full disabled:bg-gray-100" rows={3} />

        {/* LINKS */}
        <section>
          <h3 className="font-semibold">Online Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <input disabled={!isEditing} type="text" placeholder="Portfolio"
              value={profile.portfolio || ""} onChange={handleChange("portfolio")}
              className="border px-3 py-2 rounded disabled:bg-gray-100" />

            <input disabled={!isEditing} type="text" placeholder="GitHub"
              value={profile.github || ""} onChange={handleChange("github")}
              className="border px-3 py-2 rounded disabled:bg-gray-100" />

            <input disabled={!isEditing} type="text" placeholder="LinkedIn"
              value={profile.linkedin || ""} onChange={handleChange("linkedin")}
              className="border px-3 py-2 rounded disabled:bg-gray-100" />

          </div>
        </section>

        {/* CV UPLOAD */}
        <section>
          <h3 className="font-semibold">CV Upload</h3>

          {isEditing && (
            <label htmlFor="cvUpload"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded cursor-pointer">
              <FileText size={20} /> Upload / Change CV
            </label>
          )}

          <input id="cvUpload" type="file" accept="application/pdf"
            className="hidden" onChange={handleCvChange} disabled={!isEditing} />

          {profile.cvName && (
            <p className="mt-2 text-sm">{profile.cvName}</p>
          )}

          {profile.cvUrl && (
            <button type="button"
              onClick={() => window.open(`${API_BASE}${profile.cvUrl}`, "_blank")}
              className="flex items-center gap-2 text-blue-600 hover:underline mt-2">
              <Download size={18} /> Download CV
            </button>
          )}
        </section>
      </div>
    </div>
  );
}
