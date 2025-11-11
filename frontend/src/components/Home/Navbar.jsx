
import logo from '../../assets/logo.svg';

const Btn = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="rounded-xl bg-cyan-400 px-5 py-2 text-sm text-white transition hover:bg-cyan-950"
  >
    {children}
  </button>
);

export default function Navbar() {
 
  return (
    
    <nav className="flex w-full items-center justify-between bg-white mt-4">
      <div className="pl-4 sm:pl-6">
        <img src={logo} alt="Logo" className="h-24 w-36 object-contain sm:h-32 sm:w-44"  />
      </div>
        
      <div className="pr-4 sm:pr-6 flex gap-2 sm:gap-3">
        <Btn>Register</Btn>
        <Btn>Login</Btn>
        <Btn>Admin</Btn>
      </div>
      
     
    </nav>
  );
}

