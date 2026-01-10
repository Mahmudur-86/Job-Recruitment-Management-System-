import { useEffect, useState } from "react";
export default function SearchBar({ value = "", onSearch }) {
  const [local, setLocal] = useState(value);
  useEffect(() => setLocal(value), [value]);
  const submit = (e) => {
    e.preventDefault();
    onSearch && onSearch(local);
  };
  return (
    <form onSubmit={submit} className="relative mx-auto w-full max-w-4xl">
      <div className="flex items-center gap-3 rounded-xl bg-gray-400/60 px-3 py-3 border border-gray-200 shadow-sm backdrop-blur-sm">
        <input
          value={local}
          onChange={(e) => setLocal(e.target.value)}
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
