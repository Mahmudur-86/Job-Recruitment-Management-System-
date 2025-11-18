import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Briefcase, FileText, Bell, LogOut } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Manage Users", path: "/admin/users", icon: <Users size={18} /> },
    { name: "Manage Jobs", path: "/admin/jobs", icon: <Briefcase size={18} /> },
    { name: "Applicants", path: "/admin/applicants", icon: <FileText size={18} /> },
    { name: "Internship Alerts", path: "/admin/internships", icon: <Bell size={18} /> },
  ];

  const handleLogout = () => {
    alert(" Logged out successfully!");
    navigate("/"); 
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen p-4 flex flex-col justify-between">
      {/*  Top section */}
      <div>
        <h2 className="text-xl font-semibold mb-6 text-gray-700 ">Admin Panel</h2>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition ${
                  location.pathname === item.path
                    ? "bg-blue-800 text-white"
                    : "text-gray-700 hover:bg-gray-500"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/*  Bottom logout button */}
      <div className="border-t border-gray-500 pt-4 mt-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-500 w-full"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
}
