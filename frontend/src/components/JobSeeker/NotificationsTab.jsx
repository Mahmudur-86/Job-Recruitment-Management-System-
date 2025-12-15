import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function NotificationsTab() {
  const token = useMemo(() => localStorage.getItem("token"), []);

  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Interview modal
  const [open, setOpen] = useState(false);
  const [activeNotif, setActiveNotif] = useState(null);
  const [interviewLoading, setInterviewLoading] = useState(false);
  const [interview, setInterview] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  //  UI message (no alert)
  const [uiMsg, setUiMsg] = useState({ type: "", text: "" });

  //  Success popup (toast) -------------- (ADDED)
  const [toast, setToast] = useState({ show: false, text: "" }); // (ADDED)

  const showToast = (text) => {
    // (ADDED)
    setToast({ show: true, text });
    setTimeout(() => setToast({ show: false, text: "" }), 2500);
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_BASE}/api/notifications/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (e) {
      console.error("GET NOTIFICATIONS ERROR:", e);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line
  }, []);

  const markRead = async (notifId) => {
    try {
      await axios.patch(
        `${API_BASE}/api/notifications/${notifId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications((prev) =>
        prev.map((n) => (n._id === notifId ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (e) {
      console.error("MARK READ ERROR:", e);
    }
  };

  const removeNotification = async (notifId) => {
    try {
      await axios.delete(`${API_BASE}/api/notifications/${notifId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.filter((n) => n._id !== notifId));
    } catch (e) {
      console.error("DELETE NOTIFICATION ERROR:", e);
    }
  };

  const openInterview = async (notif) => {
    setOpen(true);
    setActiveNotif(notif);
    setInterview(null);
    setAnswers({});
    setSubmitted(false);
    setUiMsg({ type: "", text: "" });

    try {
      setInterviewLoading(true);

      if (!notif.isRead) await markRead(notif._id);

      const appId = notif?.data?.applicationId;
      if (!appId) return;

      const { data } = await axios.get(
        `${API_BASE}/api/interviews/application/${appId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setInterview({ title: data.title, questions: data.questions || [] });
    } catch (e) {
      console.error("GET INTERVIEW ERROR:", e);
      setInterview(null);
      setUiMsg({ type: "error", text: "Interview not found or failed to load." });
    } finally {
      setInterviewLoading(false);
    }
  };

  const closeInterview = () => {
    setOpen(false);
    setActiveNotif(null);
    setInterview(null);
    setAnswers({});
    setSubmitting(false);
    setSubmitted(false);
    setUiMsg({ type: "", text: "" });
  };

  const submitInterview = async () => {
    try {
      const appId = activeNotif?.data?.applicationId;
      if (!appId) return;

      const total = interview?.questions?.length || 0;
      if (total === 0) {
        setUiMsg({ type: "error", text: "No questions found." });
        return;
      }

      const formatted = [];
      for (let i = 0; i < total; i++) {
        const selected = answers[i];
        if (typeof selected !== "number") {
          setUiMsg({
            type: "error",
            text: "Please answer all questions before submitting.",
          });
          return;
        }
        formatted.push({ questionIndex: i, selectedOptionIndex: selected });
      }

      setSubmitting(true);
      setUiMsg({ type: "", text: "" });

      await axios.post(
        `${API_BASE}/api/interviews/application/${appId}/submit`,
        { answers: formatted },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSubmitted(true);

      //  AUTO CLOSE MODAL THEN SHOW POPUP MSG (ADDED)
      setTimeout(() => {
        closeInterview();
        showToast(
          " Your interview has been sent to the employer. Please wait for their response."
        );
      }, 2000);
    } catch (e) {
      console.error("SUBMIT INTERVIEW ERROR:", e);
      setUiMsg({
        type: "error",
        text: e?.response?.data?.message || "Submit failed",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h2 className="text-lg sm:text-xl font-bold">Notifications</h2>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">
              Unread: {unreadCount}
            </span>
          )}

          <button
            onClick={fetchNotifications}
            className="text-sm px-3 py-2 rounded-lg border hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="mt-4">
        {loading && <p className="text-gray-500 text-sm">Loading...</p>}

        {!loading && notifications.length === 0 && (
          <p className="text-gray-600">No notifications yet.</p>
        )}

        {!loading && notifications.length > 0 && (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n._id}
                className={`rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
                  n.isRead ? "bg-white" : "bg-blue-50 border-blue-200"
                }`}
              >
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {n.title || "Notification"}
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    {n.message || "-"}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {n.type === "INTERVIEW" && (
                    <button
                      onClick={() => openInterview(n)}
                      className="px-3 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                    >
                      View / Answer
                    </button>
                  )}

                  {!n.isRead && (
                    <button
                      onClick={() => markRead(n._id)}
                      className="px-3 py-2 text-sm rounded-lg border hover:bg-gray-50"
                    >
                      Mark read
                    </button>
                  )}

                  <button
                    onClick={() => removeNotification(n._id)}
                    className="px-3 py-2 text-sm rounded-lg border text-red-600 hover:bg-red-50"
                  >
                    Remove Notification
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interview Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-3 sm:px-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeInterview}
          />

          <div className="relative w-full max-w-[92vw] sm:max-w-2xl rounded-2xl bg-white shadow-xl">
            <div className="flex items-start justify-between border-b p-4 sm:p-5">
              <div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-900">
                  Interview Questions
                </h4>
                <p className="text-sm text-gray-600">
                  {interview?.title || "Loading..."}
                </p>
              </div>

              <button
                onClick={closeInterview}
                className="text-sm px-3 py-2 rounded-lg border hover:bg-gray-50"
              >
                Close
              </button>
            </div>

            <div className="p-4 sm:p-5 max-h-[75vh] overflow-y-auto">
              {interviewLoading && (
                <p className="text-gray-500 text-sm">Loading questions...</p>
              )}

              {!interviewLoading && !interview && (
                <p className="text-red-600 text-sm">Interview not found.</p>
              )}

              {!interviewLoading && interview && (
                <div className="space-y-4">
                  {uiMsg.text && (
                    <div
                      className={`rounded-xl border p-4 ${
                        uiMsg.type === "error"
                          ? "bg-red-50 border-red-200"
                          : "bg-blue-50 border-blue-200"
                      }`}
                    >
                      <p
                        className={`text-sm ${
                          uiMsg.type === "error"
                            ? "text-red-700"
                            : "text-blue-700"
                        }`}
                      >
                        {uiMsg.text}
                      </p>
                    </div>
                  )}

                  {interview.questions.map((item, idx) => (
                    <div key={idx} className="rounded-xl border p-4">
                      <p className="font-semibold text-gray-900">
                        {idx + 1}. {item.q}
                      </p>

                      <div className="mt-3 space-y-2">
                        {item.options.map((op, i) => (
                          <label
                            key={i}
                            className="flex items-center gap-2 text-sm text-gray-800"
                          >
                            <input
                              type="radio"
                              name={`q_${idx}`}
                              checked={answers[idx] === i}
                              onChange={() => {
                                setAnswers((p) => ({ ...p, [idx]: i }));
                                setUiMsg({ type: "", text: "" });
                              }}
                            />
                            <span>
                              {String.fromCharCode(65 + i)}. {op}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}

                  {submitted && (
                    <div className="rounded-xl bg-green-50 border border-green-200 p-4">
                      <p className="text-sm text-green-800">
                        Submitted successfully ✅
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="border-t p-4 sm:p-5 flex justify-end gap-2 flex-wrap">
              <button
                onClick={submitInterview}
                disabled={submitting || submitted || !interview}
                className={`rounded-xl px-4 py-2 text-sm font-medium text-white ${
                  submitted
                    ? "bg-green-600 opacity-70 cursor-not-allowed"
                    : submitting
                    ? "bg-blue-600 opacity-70 cursor-wait"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {submitted
                  ? "Submitted"
                  : submitting
                  ? "Submitting..."
                  : "Submit"}
              </button>

              {activeNotif?._id && (
                <button
                  onClick={() => {
                    removeNotification(activeNotif._id);
                    closeInterview();
                  }}
                  className="rounded-xl border px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Remove Notification
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/*  Success Toast Popup (ADDED) */}
      {toast.show && (
        <div className="fixed bottom-5 right-5 z-9999">
          <div className="rounded-xl bg-green-600 text-white px-4 py-3 shadow-lg text-sm">
            {toast.text}
          </div>
        </div>
      )}
    </div>
  );
}
