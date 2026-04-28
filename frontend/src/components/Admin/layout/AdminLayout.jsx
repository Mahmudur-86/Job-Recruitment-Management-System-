import React from "react";
import Sidebar from "./Sidebar";// Sidebar component import (left menu)
import Header from "./Header";// Header component import (top bar)


export default function AdminLayout({ children }) {
  return (
    // flex layout + full screen height + background color
    <div className="flex h-screen bg-gray-500">
 
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Header title="Admin Dashboard" />
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
