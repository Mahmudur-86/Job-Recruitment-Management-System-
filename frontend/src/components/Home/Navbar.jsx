
import logo from '../../assets/logo.svg';

import Register from "./AuthForm/Register.jsx";
import Login from "./AuthForm/Login.jsx";
import Admin from "./AuthForm/Admin.jsx";


const Btn = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="rounded-xl bg-cyan-400 px-5 py-2 text-sm text-white transition hover:bg-cyan-950"
  >
    {children}
  </button>
);

export default function Navbar({ onAuthClick }) {
 
  return (
    
    <nav className="flex w-full items-center justify-between bg-white mt-4">
      <div className="pl-4 sm:pl-6">
        <img src={logo} alt="Logo" className="h-24 w-36 object-contain sm:h-32 sm:w-44"  />
      </div>
        
      <div className="pr-4 sm:pr-6 flex gap-2 sm:gap-3">
    

 <Btn onClick={() => onAuthClick('register')}>Register</Btn>
        <Btn onClick={() => onAuthClick('login')}>Login</Btn>
        <Btn onClick={() => onAuthClick('admin')}>Admin</Btn>



        
      </div>
      
     
    </nav>
  );
}

