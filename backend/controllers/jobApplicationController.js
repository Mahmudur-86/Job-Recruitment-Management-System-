// controllers/jobApplicationController.js
const JobApplication = require("../models/JobApplication");
const Notification = require("../models/Notification");

// USER APPLY (Including MCQ answers and CV)
exports.submitApplication = async (req, res) => {
  try {
    const { jobId, jobTitle, company, appliedDate, cvName, mcqHistory } = req.body;

  
    const appliedDateFormatted = new Date().toLocaleDateString();  // Use the current date and time

    // Save job application data including MCQ answers and CV name
    const application = await JobApplication.create({
      user: req.user.id,     // Jobseeker's ID from the middleware
      jobId,
      jobTitle,
      company,
      appliedDate: appliedDateFormatted,  // Store the current applied date
      cvName,
      mcqHistory,           // Store MCQ answers
      status: "Pending",     // Default application status
    });

    // Create a notification for the jobseeker after applying
    const notification = await Notification.create({
      user: req.user.id,
      message: `You applied for ${jobTitle} at ${company}.`,
      type: "job",  // Notification type
      seen: false,   // Mark the notification as unseen initially
      date: new Date().toLocaleDateString(),  // Notification date (current date)
    });

    // Send back the application and notification details
    res.json({ application, notification });
  } catch (err) {
    console.error("Error in submitting application: ", err);
    res.status(500).json({ message: "Submit failed", error: err.message });
  }
};

// Fetch job applications for the logged-in Jobseeker
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find({ user: req.user.id })
      .populate("user", "name email")  // Get user details (name and email)
      .sort({ createdAt: -1 });        // Sort applications by most recent

    res.json(applications);  // Return the job applications with MCQ answers and CV name
  } catch (err) {
    console.error("Error fetching applications: ", err);
    res.status(500).json({ message: "Failed to fetch applications", error: err.message });
  }
};

// Fetch all job applications for the Admin (Admin view)
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find()
      .populate("user", "name email")  // Get user details
      .sort({ createdAt: -1 });        // Sort applications by most recent

    res.json({ applications });  // Return all job applications
  } catch (err) {
    console.error("Error fetching all applications: ", err);
    res.status(500).json({ message: "Failed to fetch applications", error: err.message });
  }
};
