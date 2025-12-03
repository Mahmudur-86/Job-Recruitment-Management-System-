import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ApplicationsTab() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/job-applications/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setApplications(response.data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div>
      <h2>My Applications</h2>
      <div>
        {applications.length > 0 ? (
          applications.map((app) => (
            <div key={app._id}>
              <h3>{app.jobTitle} at {app.company}</h3>
              <p>Status: {app.status}</p>
            </div>
          ))
        ) : (
          <p>No applications yet. Start browsing jobs!</p>
        )}
      </div>
    </div>
  );
};


