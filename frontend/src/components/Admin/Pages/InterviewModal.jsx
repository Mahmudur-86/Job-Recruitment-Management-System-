import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function InterviewModal({ application, onClose }) {
  const token = useMemo(() => localStorage.getItem("adminToken"), []);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setErr("");

        const res = await axios.get(
          `${API_BASE}/api/interviews/admin/application/${application._id}/submission`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setData(res.data);
      } catch (e) {
        console.error("LOAD SUBMISSION ERROR:", e);
        setErr(e?.response?.data?.message || "Failed to load interview answers");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    if (application?._id) load();
  }, [application?._id, token]);

  const getSelectedIndex = (qIndex) => {
    const found = data?.answers?.find((a) => a.questionIndex === qIndex);
    return typeof found?.selectedOptionIndex === "number" ? found.selectedOptionIndex : null;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-3">
      <div className="bg-white max-w-2xl w-full p-6 rounded-lg shadow-xl max-h-[85vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-2">Interview Answers</h2>

        {data?.submittedAt ? (
          <p className="text-sm text-gray-600 mb-4">
            Submitted: {new Date(data.submittedAt).toLocaleString()}
          </p>
        ) : (
          <p className="text-sm text-gray-600 mb-4">Not submitted yet</p>
        )}

        {loading && <p className="text-gray-600">Loading...</p>}

        {!loading && err && (
          <div className="border border-red-200 bg-red-50 p-4 rounded">
            <p className="text-red-700 text-sm">{err}</p>
          </div>
        )}

        {!loading && !err && data && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">{data.title}</h3>

            {(data.questions || []).map((q, idx) => {
              const selectedIdx = getSelectedIndex(idx);

              return (
                <div key={idx} className="border p-4 rounded-md bg-gray-50">
                  <p className="font-semibold">
                    {idx + 1}. {q.q}
                  </p>

                  <ul className="mt-2 text-sm text-gray-700 space-y-1">
                    {(q.options || []).map((opt, i) => (
                      <li key={i}>
                        {selectedIdx === i ? (
                          <span className="text-green-600 font-bold">✔ {opt}</span>
                        ) : (
                          <span className="text-gray-600">• {opt}</span>
                        )}
                      </li>
                    ))}
                  </ul>

                  {selectedIdx === null && (
                    <p className="text-xs text-orange-600 mt-2">Not answered</p>
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
