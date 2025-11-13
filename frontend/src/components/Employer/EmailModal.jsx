import { useState } from 'react';

export default function EmailModal({ person, onClose }) {
  const [message, setMessage] = useState('');
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96">
        <h3 className="text-xl font-bold mb-4">Send Email to {person.name}</h3>
        <div className="mb-2 text-sm text-gray-600">To: {person.email}</div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="w-full px-3 py-2 border rounded-lg mb-4"
          rows="6"
        />
        <div className="flex space-x-2">
          <button 
            onClick={() => {
              alert(`Email sent to ${person.email}: ${message}`);
              onClose();
            }}
            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Send
          </button>
          <button 
            onClick={onClose}
            className="flex-1 bg-gray-400 text-white py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}