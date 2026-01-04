import { useMemo, useState } from "react";

export default function JobCard({
  title,
  jobTitle,
  company,
  location,
  category,
  salary,
  vacancies,
  description,
  requirements,
  deadline,
  onApply,
}) {
  const safeTitle = title || jobTitle || "-";
  const safeVacancies = vacancies === 0 || vacancies ? String(vacancies) : "";

  const [showDesc, setShowDesc] = useState(false);
  const [showReq, setShowReq] = useState(false);

  const descText = useMemo(
    () => (description ? String(description).trim() : ""),
    [description]
  );
  const reqText = useMemo(
    () => (requirements ? String(requirements).trim() : ""),
    [requirements]
  );

  const hasDesc = Boolean(descText);
  const hasReq = Boolean(reqText);

  const LONG_TEXT_LIMIT = 170;
  const isDescLong = hasDesc && descText.length > LONG_TEXT_LIMIT;
  const isReqLong = hasReq && reqText.length > LONG_TEXT_LIMIT;

  return (
    <article
      className="
        group relative h-full overflow-hidden
        rounded-2xl border border-white/30 bg-zinc-400/90
        p-4 sm:p-5
        shadow-sm
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-lg hover:bg-zinc-300/90
        focus-within:shadow-lg
        flex flex-col
      "
    >
      {/* subtle glow */}
      <div
        className="
          pointer-events-none absolute -inset-20 opacity-0
          bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.45),transparent_55%)]
          transition-opacity duration-500
          group-hover:opacity-100
        "
      />

      {/* Header */}
      <header className="relative">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm sm:text-base font-semibold text-stone-900">
              {company || "-"}
            </h3>
            <p className="mt-1 line-clamp-2 text-xs sm:text-sm font-medium text-stone-800">
              {safeTitle}
            </p>
          </div>

          {category ? (
            <span
              className="
                shrink-0 rounded-full
                bg-rose-100/80 px-3 py-1
                text-[10px] sm:text-xs font-semibold text-stone-900
                border border-rose-200/60
              "
              title={category}
            >
              {category}
            </span>
          ) : null}
        </div>
      </header>

      {/* Meta */}
      <div className="relative mt-4 grid grid-cols-1 gap-2 text-xs sm:text-sm text-stone-800">
        <div className="flex flex-wrap gap-2">
          {location ? (
            <span className="inline-flex items-center gap-2 rounded-xl bg-white/40 px-3 py-1 border border-white/40">
              <span className="font-semibold">Location:</span>
              <span className="truncate">{location}</span>
            </span>
          ) : null}

          {salary ? (
            <span className="inline-flex items-center gap-2 rounded-xl bg-white/40 px-3 py-1 border border-white/40">
              <span className="font-semibold">Salary:</span>
              <span className="truncate">{salary}</span>
            </span>
          ) : null}

          {safeVacancies ? (
            <span className="inline-flex items-center gap-2 rounded-xl bg-white/40 px-3 py-1 border border-white/40">
              <span className="font-semibold">Vacancies:</span>
              <span>{safeVacancies}</span>
            </span>
          ) : null}

          {deadline ? (
            <span className="inline-flex items-center gap-2 rounded-xl bg-white/40 px-3 py-1 border border-white/40">
              <span className="font-semibold">Deadline:</span>
              <span className="truncate">{deadline}</span>
            </span>
          ) : null}
        </div>
      </div>

      {/* Description & Requirements */}
      {(hasDesc || hasReq) && (
        <div className="relative mt-4 space-y-3">
          {hasDesc ? (
            <div className="rounded-2xl bg-white/35 p-3 border border-white/40">
              <div className="flex items-center justify-between gap-3">
                <div className="text-[11px] sm:text-xs font-semibold text-stone-800">
                  Description
                </div>

                {isDescLong ? (
                  <button
                    type="button"
                    onClick={() => setShowDesc((s) => !s)}
                    className="
                      text-[11px] sm:text-xs font-semibold
                      text-indigo-700 hover:text-indigo-900
                      underline underline-offset-2
                    "
                  >
                    {showDesc ? "Show less" : "Show more"}
                  </button>
                ) : null}
              </div>

              <div
                className={`
                  mt-1 text-xs sm:text-sm text-stone-900
                  whitespace-pre-line wrap-break-word
                  transition-all duration-300
                  ${isDescLong ? (showDesc ? "" : "line-clamp-3") : ""}
                `}
              >
                {descText}
              </div>
            </div>
          ) : null}

          {hasReq ? (
            <div className="rounded-2xl bg-white/35 p-3 border border-white/40">
              <div className="flex items-center justify-between gap-3">
                <div className="text-[11px] sm:text-xs font-semibold text-stone-800">
                  Requirements
                </div>

                {isReqLong ? (
                  <button
                    type="button"
                    onClick={() => setShowReq((s) => !s)}
                    className="
                      text-[11px] sm:text-xs font-semibold
                      text-indigo-700 hover:text-indigo-900
                      underline underline-offset-2
                    "
                  >
                    {showReq ? "Show less" : "Show more"}
                  </button>
                ) : null}
              </div>

              <div
                className={`
                  mt-1 text-xs sm:text-sm text-stone-900
                  whitespace-pre-line wrap-break-word
                  transition-all duration-300
                  ${isReqLong ? (showReq ? "" : "line-clamp-3") : ""}
                `}
              >
                {reqText}
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* ✅ Footer pinned to bottom (equal card height look) */}
      <footer className="relative mt-auto pt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="text-xs sm:text-sm text-neutral-800">
          Ready to job request?
        </div>

        <button
          onClick={onApply}
          className="
            inline-flex w-full sm:w-auto items-center justify-center gap-2
            rounded-xl bg-indigo-600 px-5 py-2.5
            text-xs sm:text-sm font-semibold text-white
            transition-all duration-300
            hover:bg-indigo-700
            active:scale-[0.98]
            focus:outline-none focus:ring-2 focus:ring-indigo-300
          "
        >
          Job Request
          <span className="transition-transform duration-300 group-hover:translate-x-0.5">
            →
          </span>
        </button>
      </footer>
    </article>
  );
}
