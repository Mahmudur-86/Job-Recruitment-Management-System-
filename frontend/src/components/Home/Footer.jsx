// Footer.jsx
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="mx-auto max-w-6xl px-6 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Brand / About */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">Job</h3>
          <p className="text-sm">
            Your one-stop platform to discover, apply, and land the perfect job.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition">Home</a></li>
            <li><a href="#" className="hover:text-white transition">Browse Jobs</a></li>
            <li><a href="#" className="hover:text-white transition">Companies</a></li>
            <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
          </ul>
        </div>

        {/* For Employers */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-3">For Employers</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition">Post a Job</a></li>
          </ul>
        </div>
        {/* Social & Newsletter */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-3">Stay Connected</h4>
          <div className="flex gap-3 mb-4">
            <a href="#" aria-label="Facebook" className="hover:text-white transition">
              <FaFacebookF size={20} />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-white transition">
              <FaTwitter size={20} />
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-white transition">
              <FaLinkedinIn size={20} />
            </a>
            <a href="#" aria-label="GitHub" className="hover:text-white transition">
              <FaGithub size={20} />
            </a>
          </div>
          <form className="flex flex-col sm:flex-row gap-2">
 <input
              type="name"
              placeholder="Your Full Name"
              className="px-3 py-2 rounded bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="email"
              placeholder="Your email"
              className="px-3 py-2 rounded bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </form>
          <br />
            <button
              type="submit"
              className="px-6 py-2 bg-teal-600 rounded text-white text-sm hover:bg-teal-500 transition"
            >
             Send
            </button>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm">
        <p>
          © {new Date().getFullYear()}. All rights reserved. |
          <a href="#" className="ml-2 hover:text-white transition">Privacy Policy</a> |
          <a href="#" className="ml-2 hover:text-white transition">Terms of Service</a>
        </p>
      </div>
    </footer>
  );
}
