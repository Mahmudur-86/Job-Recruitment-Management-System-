// JobCard.jsx
export default function JobCard({
  company,
  tag,
  title,
  
  location,
  department,
  salary,
  deadline,
  onApply,
}) {
  return (
    <div className="rounded-2xl bg-zinc-400 p-4 shadow">
      {/* Banner image */}
     

      {/* Company & Title */}
      <div className="mt-3 text-base font-semibold text-stone-900">
        {company}
      </div>
      <div className="mt-1 text-sm font-medium text-stone-800">{title}</div>

      {/* Tag */}
      {tag && (
        <div className="mt-2">
          <span className="inline-block rounded-full bg-rose-100 px-4 py-1 text-xs text-stone-900">
            {tag}
          </span>
        </div>
      )}

      {/* Extra info */}
      <div className="mt-3 space-y-1 text-xs text-stone-800">
        {location && <p><span className="font-semibold">Location:</span> {location}</p>}
        {department && <p><span className="font-semibold">Department:</span> {department}</p>}
        {salary && <p><span className="font-semibold">Salary:</span> {salary}</p>}
        {deadline && (
          <p>
            <span className="font-semibold">Deadline:</span> {deadline}
          </p>
        )}
      </div>

      {/* Apply area */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-neutral-800">
          Ready to apply?
        </div>

        <button
          onClick={onApply}
          className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white transition hover:bg-orange-800"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
}
