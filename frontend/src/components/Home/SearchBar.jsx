import { useState } from "react";

export default function SearchBar() {
  const [q, setQ] = useState("");

 // const submit = (e) => {
   // e.preventDefault();
   // alert(`Searching: ${q}`);
  //};

  return (
    <form  className="relative mx-auto w-full max-w-4xl">
      <div className="flex items-center gap-3 rounded-xl bg-gray-400/60 px-3 py-3 border border-gray-200 shadow-sm backdrop-blur-sm">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" />
          </svg>
        </span>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Type any job title here"
          className="w-full rounded-md bg-transparent px-2 py-2 placeholder:text-black/50 outline-none"
        />

        <button
          type="submit"
          className="rounded-xl bg-teal-600 px-6 py-2 text-white transition hover:bg-emerald-600"
        >
          Search
        </button>
      </div>
    </form>
  );
}
