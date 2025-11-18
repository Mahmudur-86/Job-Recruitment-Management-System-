import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-500">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Header title="Admin Dashboard" />
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
