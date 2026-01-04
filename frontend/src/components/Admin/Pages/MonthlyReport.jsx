import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function MonthlyReport() {
  const token = useMemo(() => localStorage.getItem("adminToken"), []);
  const now = new Date();

  const [reportType, setReportType] = useState("monthly");
  const [month, setMonth] = useState(String(now.getMonth() + 1));
  const [year, setYear] = useState(String(now.getFullYear()));

  const pad2 = (n) => String(n).padStart(2, "0");
  const toYMD = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const [startDate, setStartDate] = useState(toYMD(firstDay));
  const [endDate, setEndDate] = useState(toYMD(now));

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [report, setReport] = useState(null);

  const shortId = (id) => String(id || "").slice(-6);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setErr("");

      const url =
        reportType === "monthly"
          ? `${API_BASE}/api/admin/reports/monthly`
          : `${API_BASE}/api/admin/reports/range`;

      const params =
        reportType === "monthly"
          ? { month, year }
          : { startDate, endDate };

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      setReport(res.data);
    } catch (e) {
      setReport(null);
      setErr(e?.response?.data?.message || "Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (reportType === "monthly") {
      if (!month || !year) return;
    } else {
      if (!startDate || !endDate) return;
    }
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportType, month, year, startDate, endDate]);

  const downloadPdf = async () => {
    try {
      setErr("");

      const url =
        reportType === "monthly"
          ? `${API_BASE}/api/admin/reports/monthly/pdf`
          : `${API_BASE}/api/admin/reports/range/pdf`;

      const params =
        reportType === "monthly"
          ? { month, year }
          : { startDate, endDate };

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        params,
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const fileUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = fileUrl;
      a.download =
        reportType === "monthly"
          ? `Monthly_Report_${year}_${String(month).padStart(2, "0")}.pdf`
          : `Range_Report_${startDate}_to_${endDate}.pdf`;

      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(fileUrl);
    } catch (e) {
      setErr(e?.response?.data?.message || "PDF download failed");
    }
  };

  const rows = report?.details || [];
  const sum = reportType === "monthly" ? report?.monthlySummary : report?.rangeSummary;

  const label =
    reportType === "monthly"
      ? report?.month
        ? `Month: ${report.month}`
        : ""
      : report?.rangeLabel || "";

  const cols = 14; // ✅ NEW

  const SkeletonRow = ({ cols = 14 }) => (
    <tr className="border-t">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-2 sm:px-4 py-3">
          <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
        </td>
      ))}
    </tr>
  );

  const clip = (text, max = 28) => {
    const s = String(text || "");
    if (!s) return "-";
    return s.length > max ? s.slice(0, max - 3) + "..." : s;
  };

  // sticky widths
  const COL1_W = "w-28";
  const COL2_W = "w-64";
  const COL1_LEFT = "left-0";
  const COL2_LEFT = "left-28";

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="bg-white border rounded-2xl shadow p-4 sm:p-6">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="min-w-[220px]">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900 leading-snug">
                  Job Recruitment Management System Report
                </h2>

                <p className="text-sm text-gray-700 mt-1">
                  Company Name:{" "}
                  <span className="font-semibold text-gray-900">
                    {report?.companyName || "EconoTech"}
                  </span>
                </p>

                {label ? <p className="text-xs text-gray-500 mt-1">{label}</p> : null}
              </div>

              <button
                onClick={downloadPdf}
                disabled={!report || loading}
                className="rounded-xl border px-4 py-2 bg-white hover:bg-gray-50 disabled:opacity-60 w-full sm:w-auto"
              >
                Download PDF
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <select
                className="border rounded-xl px-4 py-2 bg-white w-full"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="monthly">Monthly</option>
                <option value="range">Range</option>
              </select>

              {reportType === "monthly" ? (
                <>
                  <select
                    className="border rounded-xl px-4 py-2 bg-white w-full"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                  >
                    {Array.from({ length: 12 }).map((_, i) => (
                      <option key={i + 1} value={String(i + 1)}>
                        Month {i + 1}
                      </option>
                    ))}
                  </select>

                  <input
                    className="border rounded-xl px-4 py-2 w-full"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="Year"
                  />
                </>
              ) : (
                <>
                  <input
                    type="date"
                    className="border rounded-xl px-4 py-2 bg-white w-full"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />

                  <input
                    type="date"
                    className="border rounded-xl px-4 py-2 bg-white w-full"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </>
              )}
            </div>

            {loading ? <p className="text-sm text-gray-600 mt-3">Loading report...</p> : null}

            {err ? (
              <div className="mt-4 p-3 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm">
                {err}
              </div>
            ) : null}

            <div className="mt-3 rounded-xl border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-[1500px] w-full text-xs sm:text-sm">
                  <thead className="bg-gray-700 text-white">
                    <tr>
                      <th className={`sticky ${COL1_LEFT} z-20 bg-gray-700 text-left px-2 sm:px-4 py-3 font-semibold ${COL1_W}`}>
                        {reportType === "monthly" ? "Month" : "Range"}
                      </th>

                      <th className={`sticky ${COL2_LEFT} z-20 bg-gray-700 text-left px-2 sm:px-4 py-3 font-semibold ${COL2_W}`}>
                        Position
                      </th>

                      <th className="text-center px-2 sm:px-4 py-3 font-semibold">Job ID</th>
                      <th className="text-center px-2 sm:px-4 py-3 font-semibold">Total CV</th>
                      <th className="text-center px-2 sm:px-4 py-3 font-semibold">Pending</th>
                      <th className="text-center px-2 sm:px-4 py-3 font-semibold">Approved</th>
                      <th className="text-center px-2 sm:px-4 py-3 font-semibold">Rejected</th>
                      <th className="text-center px-2 sm:px-4 py-3 font-semibold">Interview Sent</th>
                      <th className="text-center px-2 sm:px-4 py-3 font-semibold">Interview Submitted</th>
                      <th className="text-center px-2 sm:px-4 py-3 font-semibold">Interview Pending</th>

                      <th className="text-center px-2 sm:px-4 py-3 font-semibold">Email Status</th>
                      <th className="text-center px-2 sm:px-4 py-3 font-semibold">Email Count</th>
                      <th className="text-center px-2 sm:px-4 py-3 font-semibold">Email To</th>
                      <th className="text-center px-2 sm:px-4 py-3 font-semibold">Email Date</th>
                    </tr>
                  </thead>

                  <tbody className="bg-white">
                    {loading ? (
                      <>
                        <SkeletonRow cols={cols} />
                        <SkeletonRow cols={cols} />
                        <SkeletonRow cols={cols} />
                      </>
                    ) : null}

                    {!loading && rows.length === 0 ? (
                      <tr>
                        <td className="px-2 sm:px-4 py-6 text-gray-600" colSpan={cols}>
                          No data.
                        </td>
                      </tr>
                    ) : null}

                    {!loading &&
                      rows.map((r, idx) => (
                        <tr key={`${r.jobId}-${idx}`} className="border-t hover:bg-gray-50">
                          <td className={`sticky ${COL1_LEFT} z-10 bg-white px-2 sm:px-4 py-3 text-gray-800 ${COL1_W}`} title={r.month}>
                            {clip(r.month, 18)}
                          </td>

                          <td className={`sticky ${COL2_LEFT} z-10 bg-white px-2 sm:px-4 py-3 font-medium text-gray-900 ${COL2_W}`} title={r.position}>
                            {clip(r.position, 40)}
                          </td>

                          <td className="text-center px-2 sm:px-4 py-3">{shortId(r.jobId)}</td>
                          <td className="text-center px-2 sm:px-4 py-3">{r.totalCV}</td>
                          <td className="text-center px-2 sm:px-4 py-3">{r.pending}</td>
                          <td className="text-center px-2 sm:px-4 py-3">{r.approved}</td>
                          <td className="text-center px-2 sm:px-4 py-3">{r.rejected}</td>
                          <td className="text-center px-2 sm:px-4 py-3">{r.interviewSent}</td>
                          <td className="text-center px-2 sm:px-4 py-3">{r.interviewSubmitted}</td>
                          <td className="text-center px-2 sm:px-4 py-3">{r.interviewPending}</td>

                          <td className="text-center px-2 sm:px-4 py-3">{r.emailStatus || "Not Sent"}</td>
                          <td className="text-center px-2 sm:px-4 py-3">{r.emailSentCount ?? 0}</td>

                          <td className="text-center px-2 sm:px-4 py-3" title={r.emailTo || ""}>
                            {clip(r.emailTo, 34)}
                          </td>

                          <td className="text-center px-2 sm:px-4 py-3">
                            {r.emailDate ? new Date(r.emailDate).toLocaleString() : "-"}
                          </td>
                        </tr>
                      ))}

                    {!loading && sum ? (
                      <tr className="border-t bg-gray-50">
                        <td className={`sticky ${COL1_LEFT} z-10 bg-gray-50 px-2 sm:px-4 py-3 font-bold ${COL1_W}`}>TOTAL</td>
                        <td className={`sticky ${COL2_LEFT} z-10 bg-gray-50 px-2 sm:px-4 py-3 font-bold ${COL2_W}`}>-</td>
                        <td className="text-center px-2 sm:px-4 py-3 font-bold">-</td>

                        <td className="text-center px-2 sm:px-4 py-3 font-bold">{sum.totalApplications ?? 0}</td>
                        <td className="text-center px-2 sm:px-4 py-3 font-bold">{sum.totalPendingApplications ?? 0}</td>
                        <td className="text-center px-2 sm:px-4 py-3 font-bold">{sum.totalApprovedApplications ?? 0}</td>
                        <td className="text-center px-2 sm:px-4 py-3 font-bold">{sum.totalRejectedApplications ?? 0}</td>
                        <td className="text-center px-2 sm:px-4 py-3 font-bold">{sum.interviewsSent ?? 0}</td>
                        <td className="text-center px-2 sm:px-4 py-3 font-bold">{sum.interviewsSubmitted ?? 0}</td>
                        <td className="text-center px-2 sm:px-4 py-3 font-bold">{sum.interviewsPending ?? 0}</td>

                        <td className="text-center px-2 sm:px-4 py-3 font-bold">-</td>
                        <td className="text-center px-2 sm:px-4 py-3 font-bold">{sum.emailsSent ?? 0}</td>
                        <td className="text-center px-2 sm:px-4 py-3 font-bold">-</td>
                        <td className="text-center px-2 sm:px-4 py-3 font-bold">-</td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
