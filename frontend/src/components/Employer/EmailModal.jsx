import { useMemo, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function EmailModal({ person, onClose }) {
  const token = useMemo(
    () => localStorage.getItem("token") || localStorage.getItem("adminToken"),
    []
  );

  const [subject, setSubject] = useState("Regarding your job request");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [uiMsg, setUiMsg] = useState({ type: "", text: "" });

  const sendEmail = async () => {
    try {
      setUiMsg({ type: "", text: "" });
      setSending(true);

      const res = await axios.post(
        `${API_BASE}/api/email/send`,
        { to: person.email, subject, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUiMsg({ type: "success", text: res.data?.message || "Email sent!" });
      setTimeout(() => onClose(), 800);
    } catch (e) {
      setUiMsg({
        type: "error",
        text: e?.response?.data?.message || "Failed to send email",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h3 className="text-xl font-bold mb-2">Send Email</h3>

        <div className="text-sm text-gray-600 mb-3">
          To: <span className="font-semibold">{person?.name}</span> ({person?.email})
        </div>

        {uiMsg.text && (
          <div
            className={`mb-3 p-3 rounded text-sm ${
              uiMsg.type === "success"
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            {uiMsg.text}
          </div>
        )}

        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject"
          className="w-full px-3 py-2 border rounded-lg mb-3"
        />

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="w-full px-3 py-2 border rounded-lg mb-4"
          rows="6"
        />

        <div className="flex gap-2">
          <button
            onClick={sendEmail}
            disabled={sending}
            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
          >
            {sending ? "Sending..." : "Send"}
          </button>

          <button
            onClick={onClose}
            disabled={sending}
            className="flex-1 bg-gray-400 text-white py-2 rounded hover:bg-gray-500 disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
