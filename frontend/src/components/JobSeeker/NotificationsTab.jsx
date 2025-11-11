import React from 'react';
import { Bell } from 'lucide-react';



export default function NotificationsTab({ notifications }) {

return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Bell size={24} /> Notifications
      </h2>
      
      {notifications.length === 0 ? (
        <div className="text-center py-8">
          <Bell size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map(notif => (
            <div 
              key={notif.id} 
              className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded hover:shadow transition"
            >
              <p className="text-gray-800">{notif.message}</p>
              <p className="text-sm text-gray-500 mt-1">{notif.date}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );












}