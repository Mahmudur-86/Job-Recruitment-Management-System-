export default function NavBar({ onLogout }) {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Employer </h1>
        <button onClick={onLogout} className="text-green-600 font-bold">
  Logout
</button>
      </div>
    </nav>
  );
}