



import { useState } from "react";

export default function JobCard({ company, tag, title, image }) {
 // const [applied, setApplied] = useState(false);
 // const [loading, setLoading] = useState(false);

  //const handleApply = async () => {
    //setLoading(true);
    // TODO: replace with real API call
    //await new Promise((r) => setTimeout(r, 900));
    //setApplied(true);
   //setLoading(false);
  //};

  return (
    <div className="rounded-2xl bg-zinc-400 p-4">
      {/* Banner image */}
      <div className="overflow-hidden rounded-xl">
        <img src={image} alt={title} className="h-28 w-full object-cover" />
      </div>

      {/* Title + pill */}
      <div className="mt-3 text-base font-semibold text-stone/90">{company}</div>
      <div className="mt-2">
        <span className="inline-block rounded-full bg-rose-100 px-4 py-1 text-xs text-stone/90">
          {tag}
        </span>
      </div>
      <div className="mt-4 text-sm text-stone/90">{title}</div>

      {/* Apply area */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-bold text-neutral/60">
          Ready to apply?
        </div>

        
          <button
            
            className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-5 py-2 text-bold text-white transition hover:bg-orange-800 "
          >
            {/* small paper-plane icon (inline SVG, no extra lib) */}
          
             
            
            Apply Job
          </button>
        
        
      </div>
    </div>
  );
}











