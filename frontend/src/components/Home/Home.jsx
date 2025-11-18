import { useState } from "react";
import Navbar from "./Navbar.jsx";
import Hero from "./Hero.jsx";
import JobGrid from "./JobGrid.jsx";
import LargeBanner from "./LargeBanner.jsx";
import Footer from "./Footer.jsx";
import Register from './AuthForm/Register';
import Login from './AuthForm/Login';
import Admin from './AuthForm/Admin';


export default function Home() {

  const [activeForm, setActiveForm] = useState(null);
  // 'register', 'login', 'admin', or null

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar onAuthClick={setActiveForm} />
      <Hero />

     {/* Auth Forms Modal/Overlay */}
      {activeForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          {activeForm === 'register' && <Register onBack={() => setActiveForm(null)} />}
          {activeForm === 'login' && <Login onBack={() => setActiveForm(null)} />}
          {activeForm === 'admin' && <Admin onBack={() => setActiveForm(null)} />}
        </div>
      )}

     
      <JobGrid />
      <LargeBanner />
      <Footer />
    </main>
  );
}