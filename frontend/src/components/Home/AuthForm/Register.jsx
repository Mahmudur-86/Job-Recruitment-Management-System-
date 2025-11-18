import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';


export default function Register({ onBack }) {
const [showPassword, setShowPassword] = useState(false);


  const handleSubmit = () => {
    console.log('Register submitted');
  };

   return (
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Register</h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
        
        {/* Password field with toggle icon */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
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
          Register
        </button>
        
        <button
          onClick={handleSubmit}
          className="w-full flex items-center justify-center gap-3 bg-blue-500 text-white py-3 rounded-lg border border-gray-300 hover:bg-blue-600 transition font-medium"
        >
          Continue with Google
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










