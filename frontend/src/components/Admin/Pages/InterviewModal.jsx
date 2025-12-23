import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function InterviewModal({ application, onClose }) {
  const token = useMemo(() => localStorage.getItem("adminToken"), []);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [data, setData] = useState(null);

  // admin toggle
  const [showCorrect, setShowCorrect] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setErr("");

        // 1) submission (questions + answers)
        const res = await axios.get(
          `${API_BASE}/api/interviews/admin/application/${application._id}/submission`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        let payload = res.data;

        // if correctOption missing in payload.questions, fetch job mcqs and merge
        const needsCorrect =
          Array.isArray(payload?.questions) &&
          payload.questions.length > 0 &&
          payload.questions.some((q) => typeof q?.correctOption !== "number");

        const jobId = application?.jobId?._id || application?.jobId || null;

        if (needsCorrect && jobId) {
          // 2) get jobs (we use existing endpoint, no new backend needed)
          const jobsRes = await axios.get(`${API_BASE}/api/admin/jobs`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const jobs = jobsRes.data?.jobs || [];
          const job = jobs.find((j) => String(j._id) === String(jobId));
          const mcqs = Array.isArray(job?.mcqs) ? job.mcqs : [];

          // merge correctOption by index
          payload = {
            ...payload,
            questions: (payload.questions || []).map((q, idx) => ({
              ...q,
              correctOption:
                typeof q?.correctOption === "number"
                  ? q.correctOption
                  : typeof mcqs[idx]?.correctOption === "number"
                  ? mcqs[idx].correctOption
                  : null,
            })),
          };
        }

        setData(payload);
      } catch (e) {
        console.error("LOAD SUBMISSION ERROR:", e);
        setErr(e?.response?.data?.message || "Failed to load interview answers");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    if (application?._id) load();
  }, [application?._id, token, application?.jobId]);

  const getSelectedIndex = (qIndex) => {
    const found = data?.answers?.find((a) => a.questionIndex === qIndex);
    return typeof found?.selectedOptionIndex === "number"
      ? found.selectedOptionIndex
      : null;
  };

  const getCorrectIndex = (qIndex) => {
    const q = (data?.questions || [])[qIndex];
    return typeof q?.correctOption === "number" ? q.correctOption : null;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-3">
      <div className="bg-white max-w-2xl w-full p-6 rounded-lg shadow-xl max-h-[85vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold mb-1">Interview Answers</h2>

            {data?.submittedAt ? (
              <p className="text-sm text-gray-600">
                Submitted: {new Date(data.submittedAt).toLocaleString()}
              </p>
            ) : (
              <p className="text-sm text-gray-600">Not submitted yet</p>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700 select-none">
            <input
              type=""
              checked={showCorrect}
              onChange={(e) => setShowCorrect(e.target.checked)}
            />
            
          </label>
        </div>

        {loading && <p className="text-gray-600 mt-4">Loading...</p>}

        {!loading && err && (
          <div className="border border-red-200 bg-red-50 p-4 rounded mt-4">
            <p className="text-red-700 text-sm">{err}</p>
          </div>
        )}

        {!loading && !err && data && (
          <div className="space-y-4 mt-4">
            <h3 className="font-semibold text-gray-800">{data.title}</h3>

            {(data.questions || []).map((q, idx) => {
              const selectedIdx = getSelectedIndex(idx);
              const correctIdx = getCorrectIndex(idx);

              const canJudge =
                showCorrect && selectedIdx !== null && correctIdx !== null;

              const isCorrect = canJudge && selectedIdx === correctIdx;

              return (
                <div key={idx} className="border p-4 rounded-md bg-gray-50">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-semibold">
                      {idx + 1}. {q.q}
                    </p>

                    {canJudge && (
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-semibold ${
                          isCorrect
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {isCorrect ? "Correct" : "Wrong"}
                      </span>
                    )}
                  </div>

                  <ul className="mt-3 text-sm text-gray-700 space-y-2">
                    {(q.options || []).map((opt, i) => {
                      const selected = selectedIdx === i;
                      const correct = correctIdx === i;

                      let cls = "bg-white border border-gray-200 text-gray-700";

                      if (selected)
                        cls =
                          "bg-blue-50 border border-blue-300 text-blue-800 font-semibold";

                      if (showCorrect && correctIdx !== null && correct)
                        cls =
                          "bg-green-50 border border-green-400 text-green-800 font-semibold";

                      if (
                        showCorrect &&
                        selected &&
                        correctIdx !== null &&
                        selectedIdx !== correctIdx
                      )
                        cls =
                          "bg-red-50 border border-red-300 text-red-800 font-semibold";

                      return (
                        <li key={i} className={`rounded-md px-3 py-2 ${cls}`}>
                          {selected ? "✔ " : "• "}
                          {opt}
                          {showCorrect && correctIdx !== null && correct
                            ? "  "
                            : ""}
                        </li>
                      );
                    })}
                  </ul>

                  {selectedIdx === null && (
                    <p className="text-xs text-orange-600 mt-2">Not answered</p>
                  )}

                  {showCorrect && correctIdx === null && (
                    <p className="text-xs text-yellow-700 mt-2">
                      Correct answer not found 
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-5 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  );
}
