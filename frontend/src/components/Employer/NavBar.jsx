export default function NavBar() {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Employer </h1>
        <button className="bg-red-500 px-4 py-2 rounded hover:bg-red-600">
          Logout
        </button>
      </div>
    </nav>
  );
}