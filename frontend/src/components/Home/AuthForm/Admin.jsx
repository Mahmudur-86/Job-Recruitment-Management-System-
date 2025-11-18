import { useState } from 'react';
import axios from "axios";
import { Eye, EyeOff } from 'lucide-react';

export default function Admin({ onBack }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/admin/login", {
        username,
        password
      });

      // Save JWT token
      localStorage.setItem("adminToken", res.data.token);

      // Redirect to Admin Dashboard page
      window.location.href = "/admin/dashboard";
    } catch (err) {
  console.error(err);
  setError("Invalid username or password");
}
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Admin Login</h2>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <div className="space-y-4">

        <input
          type="text"
          placeholder="Admin Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-cyan-400 text-white py-2 rounded-lg hover:bg-cyan-500 transition"
        >
          Login
        </button>
      </div>

      <button
        onClick={onBack}
        className="mt-4 text-gray-600 hover:text-gray-800"
      >
        ← Back
      </button>
    </div>
  );
}
