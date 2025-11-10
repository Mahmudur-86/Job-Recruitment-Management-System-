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

      <div className="mt-10 flex justify-center">
        <button className="rounded-xl bg-green-800 px-8 py-3 text-lg text-white shadow transition hover:bg-yellow-400">
          More Jobs
        </button>
      </div>
    </section>
  );
}
