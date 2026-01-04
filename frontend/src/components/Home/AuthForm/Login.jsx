import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

// API BASE
const RAW_API_BASE =
  import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_URL || "";
const API_BASE = RAW_API_BASE.replace(/\/+$/, "");

export default function Login({ onBack, onCreateNew, onLoginSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "jobseeker",
  });

  const handleSubmit = async () => {
    setError("");

    if (!form.email || !form.password || !form.role) {
      setError("All fields are required");
      return;
    }

    try {
      const { data } = await axios.post(
        `${API_BASE}/login`,
        {
          email: form.email,
          password: form.password,
        },
        { withCredentials: true }
      );

      const realRole = data.role;

      if (form.role !== realRole) {
        setError(
          `This account is registered as "${realRole}". Please select the correct role.`
        );
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      onLoginSuccess(realRole);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full relative overflow-hidden">
      <span className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-200/40 blur-3xl animate-pulse" />
      <span className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-300/30 blur-3xl animate-pulse" />

      <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center relative">
        Login
      </h2>

      {error && (
        <p className="text-red-600 text-sm mb-3 text-center relative">
          {error}
        </p>
      )}

      <div className="space-y-4 relative">
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full px-4 py-2 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900 transition"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-cyan-500 text-white py-2 rounded-xl hover:bg-cyan-600 transition shadow-lg hover:shadow-xl active:scale-[0.99]"
        >
          Login
        </button>

        <p className="mt-3 text-center text-sm text-gray-600">
          Don&apos;t have an account?
        </p>
        <p
          onClick={onCreateNew}
          className="text-center bg-amber-300 py-2 rounded-full cursor-pointer hover:bg-amber-400 transition font-medium"
        >
          Create a new one
        </p>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-2 border border-gray-300 rounded-full text-gray-700 font-medium transition-all duration-200 hover:text-cyan-600 hover:border-cyan-400 hover:gap-3 hover:shadow-md active:scale-95"
        >
          Back
        </button>
      </div>
    </div>
  );
}
