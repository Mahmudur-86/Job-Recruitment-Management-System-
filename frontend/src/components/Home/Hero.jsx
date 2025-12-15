import SearchBar from "./SearchBar.jsx";
export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6">
      <h1 className="text-center font-serif text-5xl sm:text-6xl font-semibold leading-tight">
        Find your <span className="text-Boy Red">Dream</span>
        <br />
        Job here!
      </h1>
      <div className="mt-10">
        <SearchBar />
      </div>
    </section>
    
  );
}
