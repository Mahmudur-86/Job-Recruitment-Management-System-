import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function NotificationsTab() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/notifications/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div>
      <h2>Notifications</h2>
      <div>
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div key={notif._id}>
              <p>{notif.message}</p>
              <p>{notif.date}</p>
            </div>
          ))
        ) : (
          <p>No notifications yet.</p>
        )}
      </div>
    </div>
  );
}


