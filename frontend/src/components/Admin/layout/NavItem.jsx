import React from 'react';

export default function NavItem({ icon, label, active, onClick, collapsed }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-lg mb-2 transition-colors ${
        active ? 'bg-blue-800 text-white' : 'hover:bg-slate-700 text-gray-300'
      }`}
    >
      {icon}
      {!collapsed && <span className="text-sm font-medium">{label}</span>}
    </button>
  );
}
