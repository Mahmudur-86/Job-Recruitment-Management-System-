import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

export default function Register({ onBack, onRegistrationSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

 
  // VALIDATION FUNCTION
 
  const validate = () => {
    if (!form.name || !form.email || !form.password || !form.role) {
      return "All fields are required";
    }

    // STRICT GMAIL ONLY VALIDATION
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(form.email)) {
      return "Please use a valid  email address";
    }

    if (form.password.length < 9) {
      return "Password must be at least 9 characters";
    }

    return "";
  };

  
  // HANDLE REGISTER SUBMIT
 
  const handleSubmit = async () => {
    const errMsg = validate();
    if (errMsg) {
      setError(errMsg);
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/register`,
        form,
        { withCredentials: true }
      );

      // SUCCESS → Go to dashboard
      onRegistrationSuccess(form.role);

    } catch (error) {
      setError(error.response?.data?.message || "Error");
    }
  };

  
  // RETURN UI
 
  return (
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">

      <h2 className="text-2xl font-bold mb-6 text-gray-800">Register</h2>

      {error && (
        <p className="text-red-600 text-sm mb-3">{error}</p>
      )}

      <div className="space-y-4">

        {/* NAME */}
        <input
          type="text"
          placeholder="Full Name"
          className="w-full px-4 py-2 border rounded-lg"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email "
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

        {/* ROLE */}
        <select
          className="w-full px-4 py-2 border rounded-lg"
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="">Select Role</option>
          <option value="jobseeker">Job Seeker</option>
          <option value="employer">Employer</option>
        </select>

        {/* REGISTER BUTTON */}
        <button
          onClick={handleSubmit}
          className="w-full bg-cyan-500 text-white py-2 rounded-lg"
        >
          Register
        </button>

      </div>

      {/* BACK BUTTON */}
      <button onClick={onBack} className="mt-4 text-gray-600">
        ← Back
      </button>

    </div>
  );
}
