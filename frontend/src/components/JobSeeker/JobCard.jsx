import React, { useState} from 'react';
import axios from 'axios';

export default function JobCard({ job, profile }) {
  const [applyNow, setApplyNow] = useState(false); // State to track if 'Apply Now' is clicked
  const [cvLink, setCvLink] = useState(null); // State to store the CV file
  const [isSubmitting, setIsSubmitting] = useState(false); // State to track submission status

  const jobDetails = {
    title: job?.title || "Job Title",
    company: job?.company || "Company Name",
    location: job?.location || "Location",
    category: job?.category || "Category",
    salary: job?.salary || "Negotiable",
    description: job?.description || "Job Description",
    requirements: job?.requirements || "Requirements",
      vacancies: job?.vacancies || "N/A" 
  };

  // Function to toggle the "Apply Now" form visibility
  const handleApplyNow = () => {
    setApplyNow(!applyNow);
  };

  // Function to handle job application submission
  const handleSubmitApplication = async () => {
    if (!cvLink) {
      alert("Please upload your CV before applying.");
      return;
    }

    setIsSubmitting(true); // Set submitting state to true

    const applicationData = {
      jobId: job._id,
      jobTitle: jobDetails.title,
      company: jobDetails.company,
      appliedDate: new Date().toLocaleDateString(),
      name: profile?.name || "Anonymous",
      email: profile?.email || "N/A",
      cvName: cvLink?.name || "UploadedCV.pdf", // Save CV name
      status: "Pending",
    };

    try {
      // Send the application data to the backend
      await axios.post('http://localhost:5000/api/job-applications', applicationData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      alert("Application submitted successfully. Wait for admin approval.");
      setIsSubmitting(false); // Reset submitting state
      setApplyNow(false); // Hide the apply form after submission
    } catch (error) {
      console.error("Error submitting application:", error);
      setIsSubmitting(false);
      alert("Error submitting application. Please try again.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-4">{jobDetails.title}</h2>
      <p className="text-lg mb-6">Company: {jobDetails.company}</p>
      <p className="text-sm mb-2">Location: {jobDetails.location}</p>
      <p className="text-sm mb-2">Category: {jobDetails.category}</p>
      <p className="text-sm mb-2">Salary: {jobDetails.salary}</p>
      <p className="text-sm mb-2">{jobDetails.description}</p>
      <p className="text-sm mb-4">Requirements: {jobDetails.requirements}</p>
      <p className="text-sm mb-4">Vacancies: {job.vacancies}</p>

      {/* Apply Now Button */}
      <button
        onClick={handleApplyNow}
        className="bg-blue-600 text-white py-2 px-4 rounded-full"
      >
        Apply Now
      </button>

      {/* CV Upload Form (Visible after clicking Apply Now) */}
      {applyNow && (
        <div className="mt-6">
          <div className="mb-6">
            <label className="text-sm font-semibold text-gray-700 mb-1 block">
              Upload Your CV (PDF Only)
            </label>
            <input
              id="cv-upload"
              type="file"
              accept="application/pdf"
              onChange={(e) => setCvLink(e.target.files[0])}
              className="hidden"
            />
            <label
              htmlFor="cv-upload"
              className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500 transition"
            >
              <p className="text-gray-700 text-sm">
                <span className="font-semibold text-blue-600">Click here</span> to upload your updated CV
              </p>
            </label>
          </div>
          {cvLink && (
            <div className="mt-4">
              <p className="text-sm text-green-600">
                CV uploaded successfully: {cvLink.name}
              </p>
              <a
      href={URL.createObjectURL(cvLink)} // View the temporary CV URL
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-500 hover:underline"
    >
      Preview CV
    </a>
            </div>
          )}
          <div className="mt-4">
            {/* Submit Application Button */}
            <button
              onClick={handleSubmitApplication}
              disabled={isSubmitting}
              className="bg-green-600 text-white py-2 px-6 rounded-full "
            >
              {isSubmitting ? "Submitting..." : "Submit "}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
