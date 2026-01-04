import { useEffect, useState } from "react";
import axios from "axios";
import JobCard from "./JobCard.jsx";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function JobGrid({ onApply, searchQuery = "" }) {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);

  //  3 jobs per page
  const limit = 3;

  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const canLoadMore = jobs.length < total;
  const canSeeLess = jobs.length > limit;

  const fetchJobs = async ({ reset = false, nextPage = 1 } = {}) => {
    try {
      setLoading(true);
      setErr("");

      const { data } = await axios.get(`${API_BASE}/api/public/jobs`, {
        params: { q: searchQuery || "", page: nextPage, limit },
      });

      const newJobs = data?.jobs || [];
      const newTotal = Number(data?.total || 0);

      setTotal(newTotal);

      if (reset) {
        setJobs(newJobs);
      } else {
        if (newJobs.length > 0) {
          setJobs((prev) => [...prev, ...newJobs]);
        }
      }
    } catch (e) {
      console.error("PUBLIC LOAD JOBS ERROR:", e);
      setErr(e?.response?.data?.message || "Failed to load jobs");
      if (reset) setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchJobs({ reset: true, nextPage: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleSeeMore = () => {
    if (!canLoadMore || loading) return;
    const next = page + 1;
    setPage(next);
    fetchJobs({ reset: false, nextPage: next });
  };

  const handleSeeLess = () => {
    if (loading) return;
    setPage(1);
    fetchJobs({ reset: true, nextPage: 1 });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Header (optional vibe) */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            
           
          </div>
        </div>
      </div>

      {err && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {err}
        </div>
      )}

      {loading && jobs.length === 0 && (
        <div className="py-10 text-center text-gray-700 animate-pulse">
          Loading jobs...
        </div>
      )}

      {!loading && jobs.length === 0 && (
        <div className="py-10 text-center text-gray-700">
          No jobs found{searchQuery ? ` for "${searchQuery}"` : ""}.
        </div>
      )}

      <div
        className="
          grid grid-cols-1 gap-5
          sm:grid-cols-2 sm:gap-6
          lg:grid-cols-3 lg:gap-7
        "
      >
        {jobs.map((j) => (
          <div key={j._id} className="animate-[fadeUp_.45s_ease-out]h-full flex">
            <JobCard
              title={j.title}
              company={j.company}
              location={j.location}
              category={j.category}
              salary={j.salary}
              vacancies={j.vacancies}
              description={j.description}
              requirements={j.requirements}
              onApply={() => onApply && onApply(j)}
            />
          </div>
        ))}
      </div>

      {/* Buttons */}
      {(jobs.length > 0 || loading) && (
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleSeeMore}
            disabled={loading || !canLoadMore}
            className="
              w-full sm:w-auto
              rounded-2xl bg-green-800 px-7 py-3
              text-base sm:text-lg font-semibold text-white
              shadow-sm transition-all duration-300
              hover:bg-cyan-600 hover:-translate-y-0.5 hover:shadow-lg
              active:scale-[0.99]
              disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0
            "
          >
            {loading ? "Loading..." : canLoadMore ? "See More Jobs" : "No More Jobs"}
          </button>

          {canSeeLess && (
            <button
              onClick={handleSeeLess}
              disabled={loading}
              className="
                w-full sm:w-auto
                rounded-2xl bg-gray-900 px-6 py-3
                text-base sm:text-lg font-semibold text-white
                shadow-sm transition-all duration-300
                hover:bg-gray-700 hover:-translate-y-0.5 hover:shadow-lg
                active:scale-[0.99]
                disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0
              "
            >
              See Less Jobs
            </button>
          )}
        </div>
      )}

      {/* local keyframes (Tailwind arbitrary animation used above) */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
