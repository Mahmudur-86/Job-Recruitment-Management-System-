import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

export default function Login({ onBack, onCreateNew, onLoginSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "", // user-selected role
  });

  const handleSubmit = async () => {
    setError("");

    if (!form.email || !form.password || !form.role) {
      setError("All fields are required");
      return;
    }

    try {
      
      const { data } = await axios.post(
        "http://localhost:5000/login",
        {
          email: form.email,
          password: form.password,
        },
        { withCredentials: true }
      );

      //  real backend role
      const realRole = data.role;

      //  Secure role match check
      if (form.role !== realRole) {
        setError(`This account is registered as "${realRole}". Please select the correct role.`);
        return;
      }

      // Login success → send role to Home.jsx
      onLoginSuccess(realRole);

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Login</h2>

      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      <div className="space-y-4">

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border rounded-lg"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        {/* PASSWORD */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full px-4 py-2 pr-12 border rounded-lg"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* ROLE SELECTOR */}
        <select
          className="w-full px-4 py-2 border rounded-lg"
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="">Login as...</option>
          <option value="jobseeker">Job Seeker</option>
          <option value="employer">Employer</option>
        </select>

        {/* LOGIN BUTTON */}
        <button
          onClick={handleSubmit}
          className="w-full bg-cyan-500 text-white py-2 rounded-lg hover:bg-cyan-600"
        >
          Login
        </button>

        {/* CREATE NEW ACCOUNT LINK */}
        <span>
          <p className="mt-2 text-center bg-amber-700 rounded-t-full">Don't have an account?</p>
        </span>
        <p
          onClick={onCreateNew}
          className="text-center bg-amber-300 py-1 rounded-b-full cursor-pointer mt-2 hover:bg-amber-400"
        >
          Create a new one
        </p>

      </div>

      {/* BACK BUTTON */}
      <button onClick={onBack} className="mt-6 text-gray-800 hover:text-black">
        ← Back
      </button>
    </div>
  );
}
