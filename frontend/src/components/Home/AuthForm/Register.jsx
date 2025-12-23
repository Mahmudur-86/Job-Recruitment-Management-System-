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
    role: "jobseeker", //  fixed role
  });

  // VALIDATION FUNCTION
  const validate = () => {
    if (!form.name || !form.email || !form.password || !form.role) {
      return "All fields are required";
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(form.email)) {
      return "Please use a valid email address";
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
      await axios.post(`${import.meta.env.VITE_API_URL}/register`, form, {
        withCredentials: true,
      });

      onRegistrationSuccess(form.role);
    } catch (error) {
      setError(error.response?.data?.message || "Error");
    }
  };

  // RETURN UI
  return (
    <div className="w-full max-w-md">
      {/* Outer glow vibe */}
      <div className="relative rounded-2xl p-px bg-linear-to-br from-cyan-200 via-white to-cyan-200 shadow-2xl">
        <div className="relative bg-white/90 backdrop-blur rounded-2xl shadow-xl p-8 w-full overflow-hidden animate-[fadeInUp_.35s_ease-out]">
          {/* soft animated blobs */}
          <span className="pointer-events-none absolute -top-16 -left-16 h-40 w-40 rounded-full bg-cyan-200/50 blur-2xl animate-[floaty_5s_ease-in-out_infinite]" />
          <span className="pointer-events-none absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-cyan-300/40 blur-2xl animate-[floaty_6.5s_ease-in-out_infinite]" />

          <h2 className="text-2xl font-bold mb-2 text-gray-900 text-center">
            Register
          </h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Create your Job Seeker account
          </p>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-red-700 text-sm text-center">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* NAME */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">Full Name</label>
              <input
                type="text"
                placeholder="e.g. Md.Mahmudur Rahman"
                className="w-full px-4 py-2.5 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-300 transition shadow-sm"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            {/* EMAIL */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">Email</label>
              <input
                type="email"
                placeholder="example@gmail.com"
                className="w-full px-4 py-2.5 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-300 transition shadow-sm"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            {/* PASSWORD */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 9 characters "
                  className="w-full px-4 py-2.5 pr-12 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-300 transition shadow-sm"
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900 transition"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/*  ROLE (CENTERED JOBSEEKER) */}
          

            {/* REGISTER BUTTON */}
            <button
              onClick={handleSubmit}
              className="w-full py-2.5 rounded-xl font-semibold text-white bg-linear-to-r from-cyan-500 via-cyan-600 to-cyan-500 shadow-lg hover:shadow-xl transition active:scale-[0.99]"
            >
              Register
            </button>
          </div>

             {/* BACK BUTTON */}
  <div className="mt-6 flex justify-center">
  <button
    onClick={onBack}
    className="
      flex items-center gap-2
      px-5 py-2
      border border-gray-300
      rounded-full
      text-gray-700 font-medium
      transition-all duration-200
      hover:text-cyan-600
      hover:border-cyan-400
      hover:gap-3
      hover:shadow-md
      active:scale-95
    "
  >
    
    Back
  </button>
</div>

         
        </div>
      </div>
    </div>
  );
}
