import React, { useState } from 'react';
import { GraduationCap, Upload, FileText } from 'lucide-react';
import axios from 'axios';

export default function InternTab({ onSubmit, internRequests }) {
  const [formData, setFormData] = useState({
    studentName: '',
    studentId: '',
    university: '',
    batch: '',
    department: '',
    email: '',
    cv: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "cv") {
      setFormData({ ...formData, cv: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.cv) {
      alert("Please upload your latest CV.");
      return;
    }

    const request = {
      ...formData,
      cvName: formData.cv.name,
      status: 'pending', // Default status
      submittedDate: new Date().toLocaleDateString()
    };

    // Save to backend first (via API)
    try {
      const token = localStorage.getItem('token');  // Get token from localStorage

      const response = await axios.post('http://localhost:5000/api/interns', request, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Once successfully submitted, update local state
      onSubmit(response.data);

      alert("Intern request submitted! Now Employer will review it.");
      setFormData({
        studentName: '',
        studentId: '',
        university: '',
        batch: '',
        department: '',
        email: '',
        cv: null
      });
    } catch (error) {
      console.error('Error submitting intern request:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md max-w-2xl mx-auto">

      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <GraduationCap size={26} className="text-blue-600" />
        Apply for Student Internship
      </h2>

      <form className="space-y-5" onSubmit={handleSubmit}>

        {/* Inputs */}
        {[
          { label: "Student Name", name: "studentName" },
          { label: "Student ID", name: "studentId" },
          { label: "University", name: "university" },
          { label: "Batch", name: "batch" },
          { label: "Department", name: "department" },
        ].map((field) => (
          <div key={field.name}>
            <label className="block mb-1 font-medium">{field.label} *</label>
            <input
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              required
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        ))}

        {/* Email */}
        <div>
          <label className="block mb-1 font-medium">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* CV Upload */}
        <div>
          <label className="block mb-2 font-medium">Upload Latest CV *</label>

          <label className="flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-3 cursor-pointer hover:bg-gray-50 transition">
            <Upload size={20} className="text-blue-600" />
            <span className="text-gray-600">
              {formData.cv ? formData.cv.name : "Choose a file (.pdf, .doc, .docx)"}
            </span>
            <input
              type="file"
              name="cv"
              accept=".pdf,.doc,.docx"
              onChange={handleChange}
              required
              className="hidden"
            />
          </label>
        </div>

        {/* Submit button */}
        <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg w-full font-medium hover:bg-blue-700 transition">
          Submit Request
        </button>
      </form>

      {/* Submitted Requests */}
      {internRequests.length > 0 && (
        <div className="mt-8">
          <h3 className="font-semibold text-xl mb-4">My Submitted Requests</h3>

          <div className="space-y-4">
            {internRequests.map(req => (
              <div key={req.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-gray-50">

                <div className="space-y-1">
                  <p><b>Name:</b> {req.studentName}</p>
                  <p><b>University:</b> {req.university}</p>
                  <p><b>Department:</b> {req.department}</p>
                  <p><b>Batch:</b> {req.batch}</p>
                  <p><b>Email:</b> {req.email}</p>
                </div>

                {/* CV display */}
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                  <FileText size={18} className="text-blue-600" />
                  <span>CV: {req.cvName}</span>
                </div>

                {/* Status + Date */}
                <div className="flex justify-between items-center mt-3 pt-3 border-t">
                  <p className="text-sm text-gray-500">Submitted: {req.submittedDate}</p>

                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    req.status === 'pending'
                      ? "bg-yellow-100 text-yellow-700"
                      : req.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {req.status.toUpperCase()}
                  </span>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
