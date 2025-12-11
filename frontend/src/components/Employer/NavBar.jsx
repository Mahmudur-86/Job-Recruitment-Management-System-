export default function NavBar({ onLogout }) {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Employer</h1>

        <button
          onClick={onLogout}
          className="px-4 py-2 rounded-lg bg-white text-blue-700 font-semibold hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
