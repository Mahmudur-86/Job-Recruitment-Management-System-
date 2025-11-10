import Navbar from "./Navbar.jsx";
import Hero from "./Hero.jsx";
import JobGrid from "./JobGrid.jsx";

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-100 text-stone-800">
      <Navbar />
      <Hero />
      <JobGrid />
    </main>
  );
}
