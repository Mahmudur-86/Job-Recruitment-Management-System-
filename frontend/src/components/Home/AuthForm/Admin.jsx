import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

export default function Admin({ onBack }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/login`,
        {
          username,
          password,
        }
      );

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
    <div className="w-full max-w-md">
      {/* Admin border ring */}
      <div className="relative rounded-3xl p-px bg-linear-to-br from-slate-300 via-white to-cyan-200 shadow-2xl">
        <div className="relative bg-white/90 backdrop-blur rounded-3xl shadow-xl p-8 sm:p-10 w-full overflow-hidden ">
          {/* Admin vibe background effects */}
          <span className="pointer-events-none absolute -top-28 -right-28 w-80 h-80 bg-slate-200/50 blur-3xl " />
          <span className="pointer-events-none absolute -bottom-28 -left-28 w-80 h-80 bg-cyan-200/40 blur-3xl animate-[floaty_8.5s_ease-in-out_infinite]" />
          <span className="pointer-events-none absolute -left-60 top-0 h-full w-52 bg-white/70 rotate-12 blur-md opacity-50 " />

          <h2 className="text-2xl font-extrabold mb-2 text-gray-900 text-center relative">
            Admin Login
          </h2>
          

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 animate-[popIn_.18s_ease-out]">
              <p className="text-red-700 text-sm text-center">{error}</p>
            </div>
          )}

          <div className="space-y-4 relative">
            <input
              type="text"
              placeholder="Admin Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-300 transition shadow-sm hover:shadow-md focus:shadow-lg"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-300 transition shadow-sm hover:shadow-md focus:shadow-lg"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 transition active:scale-95"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-2.5 rounded-xl font-semibold text-white bg-linear-to-r from-slate-800 via-slate-900 to-slate-800 shadow-lg hover:shadow-2xl transition active:scale-[0.99] hover:-translate-y-px animate-[btnGlowAdmin_3.2s_ease-in-out_infinite]"
            >
              Login
            </button>
          </div>

          {/* Back centered + boxed */}
          <div className="mt-6 flex justify-center relative">
            <button
              onClick={onBack}
              className="
                flex items-center gap-2
                px-5 py-2
                border border-gray-300
                rounded-full
                text-gray-700 font-medium
                transition-all duration-200
                hover:text-cyan-700
                hover:border-cyan-400
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
