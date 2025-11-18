import React, { useState } from 'react';
import { GraduationCap } from 'lucide-react';



export default function InternTab({ onSubmit, internRequests }) {
 const [formData, setFormData] = useState({
    studentName: '',
    studentId: '',
    university: '',
    batch: '',
    department: '',
    email: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const request = {
      id: internRequests.length + 1,
      ...formData,
      status: 'pending',
      submittedDate: new Date().toLocaleDateString()
    };
    
    onSubmit(request);
    alert('Intern request submitted! Admin will review and approve.');
    
    // Reset form
    setFormData({
      studentName: '',
      studentId: '',
      university: '',
      batch: '',
      department: '',
      email: ''
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <GraduationCap size={24} /> Student Intern Request
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Student Name *</label>
          <input
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Student ID *</label>
          <input
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">University Name *</label>
          <input
            name="university"
            value={formData.university}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Batch *</label>
          <input
            name="batch"
            value={formData.batch}
            onChange={handleChange}
            placeholder="e.g., 2024"
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Department *</label>
          <input
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="e.g., Computer Science"
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Email *</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Submit Request
        </button>
      </div>

      {/* Display Submitted Requests */}
      {internRequests.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-3 text-lg">My Requests</h3>
          <div className="space-y-2">
            {internRequests.map(req => (
              <div key={req.id} className="border p-3 rounded hover:shadow transition">
                <p className="font-medium">{req.studentName} - {req.university}</p>
                <p className="text-sm text-gray-600">Batch: {req.batch} | Department: {req.department}</p>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-500">Submitted: {req.submittedDate}</p>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    req.status === 'pending' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : req.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
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
};