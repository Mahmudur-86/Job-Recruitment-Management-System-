import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function CompanyProfile({ setCurrentPage, profile, setProfile }) {
  const [profileMode, setProfileMode] = useState("view");
  const [showSuccess, setShowSuccess] = useState(false);
  const [previewLogo, setPreviewLogo] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  //  Load profile (GET /api/employer/profile)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const token =
          localStorage.getItem("employerToken") || localStorage.getItem("token");

        if (!token) {
          setError("Please logout and login again.");
          setLoading(false);
          return;
        }

        const res = await axios.get(`${API_BASE}/api/employer/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data && res.data.profile) {
          const apiProfile = res.data.profile;

          const logoUrl = apiProfile.companyLogo
            ? `${API_BASE}/${apiProfile.companyLogo}`
            : "";

          //  IMPORTANT: keep SAME field names as backend
          setProfile((prev) => ({
            ...prev,
            EmployerName: apiProfile.EmployerName || "",
            CompanyName: apiProfile.CompanyName || "",
            email: apiProfile.email || "",
            address: apiProfile.address || "",
            phone: apiProfile.phone || "",
            website: apiProfile.website || "",
            companyLogo: logoUrl,
            companyLogoFile: null,
          }));

          setPreviewLogo(logoUrl);
          localStorage.setItem("employerProfile", JSON.stringify(apiProfile));
        }
      } catch (err) {
        console.error("Error loading employer profile:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //  Image upload preview
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageURL = URL.createObjectURL(file);

    setProfile((prev) => ({
      ...prev,
      companyLogoFile: file,
      companyLogo: imageURL, // temp preview
    }));

    setPreviewLogo(imageURL);
  };

  //  Save profile (POST /api/employer/profile)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);

      const token =
        localStorage.getItem("employerToken") || localStorage.getItem("token");

      if (!token) {
        alert("Please logout and login again.");
        setSaving(false);
        return;
      }

      const formData = new FormData();

      //   match backend keys exactly:
      formData.append("EmployerName", profile.EmployerName || "");
      formData.append("CompanyName", profile.CompanyName || "");
      formData.append("email", profile.email || "");
      formData.append("address", profile.address || "");
      formData.append("phone", profile.phone || "");
      formData.append("website", profile.website || "");

      if (profile.companyLogoFile) {
        formData.append("companyLogo", profile.companyLogoFile);
      }

      const res = await axios.post(`${API_BASE}/api/employer/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data && res.data.profile) {
        const apiProfile = res.data.profile;

        const logoUrl = apiProfile.companyLogo
          ? `${API_BASE}/${apiProfile.companyLogo}`
          : "";

        setProfile((prev) => ({
          ...prev,
          EmployerName: apiProfile.EmployerName || "",
          CompanyName: apiProfile.CompanyName || "",
          email: apiProfile.email || "",
          address: apiProfile.address || "",
          phone: apiProfile.phone || "",
          website: apiProfile.website || "",
          companyLogo: logoUrl,
          companyLogoFile: null,
        }));

        setPreviewLogo(logoUrl);
        localStorage.setItem("employerProfile", JSON.stringify(apiProfile));

        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 1200);
        setProfileMode("view");
      }
    } catch (err) {
      console.error("Error saving employer profile:", err);
      setError("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-100 px-4">
        <p className="text-gray-700 text-sm sm:text-base">
          Loading company profile...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 sm:py-10 px-3 sm:px-4">
      <div className="mx-auto w-full max-w-xl sm:max-w-2xl lg:max-w-3xl bg-white shadow-lg rounded-2xl p-4 sm:p-6 lg:p-8">
        <button
          onClick={() => setCurrentPage("dashboard")}
          className="text-blue-600 hover:underline mb-4 text-sm sm:text-base"
        >
          ← Back to Dashboard
        </button>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 border border-red-300 text-sm sm:text-base">
            {error}
          </div>
        )}

        {showSuccess && (
          <div className="mb-6 p-4 rounded-lg bg-green-100 text-green-700 border border-green-300 text-sm sm:text-base">
            Profile updated successfully!
          </div>
        )}

        {/* VIEW MODE */}
        {profileMode === "view" && (
          <>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-6 sm:mb-8">
              Company Profile
            </h2>

            <div className="flex justify-center mb-5 sm:mb-6">
              {previewLogo || profile.companyLogo ? (
                <img
                  src={previewLogo || profile.companyLogo}
                  alt="Company Logo"
                  className="h-24 w-24 sm:h-28 sm:w-28 lg:h-32 lg:w-32 rounded-full border object-cover shadow"
                />
              ) : (
                <div className="h-24 w-24 sm:h-28 sm:w-28 lg:h-32 lg:w-32 rounded-full bg-gray-200 flex justify-center items-center text-gray-500 text-sm sm:text-base lg:text-lg shadow">
                  No Logo
                </div>
              )}
            </div>

            <div className="text-gray-700 text-sm sm:text-base lg:text-lg space-y-3 sm:space-y-4">
              <p>
                <span className="font-semibold">Employer Name:</span>{" "}
                {profile.EmployerName || ""}
              </p>

              <p>
                <span className="font-semibold">Company Name:</span>{" "}
                {profile.CompanyName || ""}
              </p>

              <p>
                <span className="font-semibold">Address:</span>{" "}
                {profile.address || ""}
              </p>

              <p>
                <span className="font-semibold">Company Contact:</span>{" "}
                {profile.phone || ""}
              </p>

              <p className="break-all">
                <span className="font-semibold">Email:</span>{" "}
                {profile.email || ""}
              </p>

              <p className="break-all">
                <span className="font-semibold">Website:</span>{" "}
                {profile.website || ""}
              </p>
            </div>

            <button
              onClick={() => setProfileMode("edit")}
              className="mt-6 sm:mt-8 w-full bg-green-600 text-white py-2.5 sm:py-3 rounded-xl text-base sm:text-lg shadow hover:bg-green-700 transition"
            >
              Edit Profile
            </button>
          </>
        )}

        {/* EDIT MODE */}
        {profileMode === "edit" && (
          <>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-5 sm:mb-6 text-center">
              Edit Company Profile
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              {/* Logo */}
              <div className="text-center">
                <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                  Company Logo
                </label>

                <label
                  htmlFor="logoUpload"
                  className="cursor-pointer flex flex-col justify-center items-center h-24 w-24 sm:h-28 sm:w-28 lg:h-32 lg:w-32 mx-auto rounded-full bg-gray-100 border hover:bg-gray-200 transition shadow overflow-hidden"
                >
                  {previewLogo || profile.companyLogo ? (
                    <img
                      src={previewLogo || profile.companyLogo}
                      alt="Company Logo"
                      className="h-full w-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-gray-500 text-xl sm:text-2xl">📷</span>
                  )}
                </label>

                <input
                  id="logoUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Employer Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                  Employer Name
                </label>
                <input
                  type="text"
                  value={profile.EmployerName || ""}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, EmployerName: e.target.value }))
                  }
                  className="w-full p-2.5 sm:p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  required
                />
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                  Company Name
                </label>
                <input
                  type="text"
                  value={profile.CompanyName || ""}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, CompanyName: e.target.value }))
                  }
                  className="w-full p-2.5 sm:p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  required
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                  Address
                </label>
                <textarea
                  value={profile.address || ""}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, address: e.target.value }))
                  }
                  rows="3"
                  className="w-full p-2.5 sm:p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                  Company Contact
                </label>
                <input
                  type="text"
                  value={profile.phone || ""}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="w-full p-2.5 sm:p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                  Email
                </label>
                <input
                  type="email"
                  value={profile.email || ""}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full p-2.5 sm:p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 text-sm sm:text-base break-all"
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                  Website
                </label>
                <input
                  type="text"
                  value={profile.website || ""}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, website: e.target.value }))
                  }
                  className="w-full p-2.5 sm:p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 text-sm sm:text-base break-all"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-blue-600 text-white py-2.5 sm:py-3 rounded-xl text-base sm:text-lg shadow hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save"}
              </button>

              <button
                type="button"
                onClick={() => setProfileMode("view")}
                className="w-full bg-gray-200 text-gray-700 py-2.5 sm:py-3 rounded-xl text-base sm:text-lg shadow hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
