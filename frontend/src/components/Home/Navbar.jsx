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
    <nav className="mx-auto flex max-w-6xl items-center justify-end gap-4 px-6 py-6">
      
      <Btn>Register</Btn>
      <Btn>Login</Btn>
      <Btn>Admin</Btn>
    </nav>
  );
}
