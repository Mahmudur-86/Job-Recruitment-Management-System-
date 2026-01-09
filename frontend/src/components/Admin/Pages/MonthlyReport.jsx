import { useCallback, useEffect, useMemo, useState } from "react";
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

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      setErr("");

      const url =
        reportType === "monthly"
          ? `${API_BASE}/api/admin/reports/monthly`
          : `${API_BASE}/api/admin/reports/range`;

      const params = reportType === "monthly" ? { month, year } : { startDate, endDate };

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
  }, [reportType, month, year, startDate, endDate, token]);

  useEffect(() => {
    if (reportType === "monthly") {
      if (!month || !year) return;
    } else {
      if (!startDate || !endDate) return;
    }
    fetchReport();
  }, [fetchReport, reportType, month, year, startDate, endDate]);

  const downloadPdf = useCallback(async () => {
    try {
      setErr("");

      const url =
        reportType === "monthly"
          ? `${API_BASE}/api/admin/reports/monthly/pdf`
          : `${API_BASE}/api/admin/reports/range/pdf`;

      const params = reportType === "monthly" ? { month, year } : { startDate, endDate };

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
  }, [reportType, month, year, startDate, endDate, token]);

  const rows = report?.details || [];
  const sum = reportType === "monthly" ? report?.monthlySummary : report?.rangeSummary;

  const label =
    reportType === "monthly"
      ? report?.month
        ? `Month: ${report.month}`
        : ""
      : report?.rangeLabel || "";

  // ✅ Added Recruitment Letter column => total cols = 13
  const cols = 13;

  const SkeletonRow = ({ cols: c = 13 }) => (
    <tr className="border-t">
      {Array.from({ length: c }).map((_, i) => (
        <td key={i} className="px-3 py-3">
          <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
        </td>
      ))}
    </tr>
  );

  // (mobile/tablet)
  const COL1_W = "w-32 min-w-[128px]";
  const COL2_W = "w-72 min-w-[288px]";
  const COL1_LEFT = "md:left-0";
  const COL2_LEFT = "md:left-32";
  const STICKY = "md:sticky";
  const STICKY_Z = "md:z-20";

  // Job ID visible
  const JOBID_TH = "w-[120px] min-w-[120px]";
  const JOBID_TD = "w-[120px] min-w-[120px] font-mono tracking-wider";

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="space-y-6">
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

            {/* Filters */}
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
                    inputMode="numeric"
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

            {/* Table wrapper responsive */}
            <div className="mt-4 rounded-xl border overflow-hidden bg-white">
              <div className="w-full overflow-x-auto">
                <table className="min-w-[1600px] w-full table-fixed text-[11px] sm:text-sm">
                  <thead className="bg-gray-700 text-white">
                    <tr>
                      <th
                        className={`${STICKY} ${COL1_LEFT} ${STICKY_Z} bg-gray-700 text-left px-3 py-3 font-semibold ${COL1_W}`}
                      >
                        {reportType === "monthly" ? "Month" : "Range"}
                      </th>
                      <th
                        className={`${STICKY} ${COL2_LEFT} ${STICKY_Z} bg-gray-700 text-left px-3 py-3 font-semibold ${COL2_W}`}
                      >
                        Position
                      </th>
                      <th className={`text-center px-3 py-3 font-semibold ${JOBID_TH}`}>Job ID</th>
                      <th className="text-center px-3 py-3 font-semibold w-[90px]">Total CV</th>
                      <th className="text-center px-3 py-3 font-semibold w-[90px]">Pending</th>
                      <th className="text-center px-3 py-3 font-semibold w-[90px]">Approved</th>
                      <th className="text-center px-3 py-3 font-semibold w-[90px]">Rejected</th>
                      <th className="text-center px-3 py-3 font-semibold w-[120px]">Interview Sent</th>
                      <th className="text-center px-3 py-3 font-semibold w-[150px]">Interview Submitted</th>
                      <th className="text-center px-3 py-3 font-semibold w-[140px]">Interview Pending</th>

                      {/* ✅ NEW */}
                      <th className="text-center px-3 py-3 font-semibold w-[150px]">
                        Recruitment Letter
                      </th>

                      <th className="text-center px-3 py-3 font-semibold w-[120px]">Email Status</th>

                      <th className="text-left px-3 py-3 font-semibold w-[520px]">
                        Email To (with time)
                      </th>
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
                        <td className="px-3 py-6 text-gray-600" colSpan={cols}>
                          No data.
                        </td>
                      </tr>
                    ) : null}

                    {!loading &&
                      rows.map((r, idx) => (
                        <tr key={`${r.jobId}-${idx}`} className="border-t hover:bg-gray-50 align-top">
                          <td
                            className={`${STICKY} ${COL1_LEFT} md:z-10 bg-white px-3 py-3 text-gray-800 ${COL1_W} whitespace-normal wrap-break-word`}
                          >
                            {r.month || "-"}
                          </td>

                          <td
                            className={`${STICKY} ${COL2_LEFT} md:z-10 bg-white px-3 py-3 font-medium text-gray-900 ${COL2_W} whitespace-normal wrap-break-word`}
                          >
                            {r.position || "-"}
                          </td>

                          <td
                            className={`text-center px-3 py-3 ${JOBID_TD} whitespace-nowrap`}
                            title={String(r.jobId || "")}
                          >
                            {shortId(r.jobId)}
                          </td>

                          <td className="text-center px-3 py-3 whitespace-nowrap">{r.totalCV}</td>
                          <td className="text-center px-3 py-3 whitespace-nowrap">{r.pending}</td>
                          <td className="text-center px-3 py-3 whitespace-nowrap">{r.approved}</td>
                          <td className="text-center px-3 py-3 whitespace-nowrap">{r.rejected}</td>
                          <td className="text-center px-3 py-3 whitespace-nowrap">{r.interviewSent}</td>
                          <td className="text-center px-3 py-3 whitespace-nowrap">{r.interviewSubmitted}</td>
                          <td className="text-center px-3 py-3 whitespace-nowrap">{r.interviewPending}</td>

                          {/* ✅ NEW */}
                          <td className="text-center px-3 py-3 whitespace-nowrap">
                            {r.recruitmentLetterStatus || "Not Sent"}
                          </td>

                          <td className="text-center px-3 py-3 whitespace-nowrap">
                            {r.emailStatus || "Not Sent"}
                          </td>

                          <td className="text-left px-3 py-3 whitespace-normal wrap-break-word">
                            {r.emailTo || "-"}
                          </td>
                        </tr>
                      ))}

                    {!loading && sum ? (
                      <tr className="border-t bg-gray-50">
                        <td className={`${STICKY} ${COL1_LEFT} md:z-10 bg-gray-50 px-3 py-3 font-bold ${COL1_W}`}>
                          TOTAL
                        </td>
                        <td className={`${STICKY} ${COL2_LEFT} md:z-10 bg-gray-50 px-3 py-3 font-bold ${COL2_W}`}>
                          -
                        </td>
                        <td className={`text-center px-3 py-3 font-bold ${JOBID_TH}`}>-</td>
                        <td className="text-center px-3 py-3 font-bold">{sum.totalApplications ?? 0}</td>
                        <td className="text-center px-3 py-3 font-bold">{sum.totalPendingApplications ?? 0}</td>
                        <td className="text-center px-3 py-3 font-bold">{sum.totalApprovedApplications ?? 0}</td>
                        <td className="text-center px-3 py-3 font-bold">{sum.totalRejectedApplications ?? 0}</td>
                        <td className="text-center px-3 py-3 font-bold">{sum.interviewsSent ?? 0}</td>
                        <td className="text-center px-3 py-3 font-bold">{sum.interviewsSubmitted ?? 0}</td>
                        <td className="text-center px-3 py-3 font-bold">{sum.interviewsPending ?? 0}</td>
                        <td className="text-center px-3 py-3 font-bold">-</td>
                        <td className="text-center px-3 py-3 font-bold">-</td>
                        <td className="text-left px-3 py-3 font-bold">-</td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>

              <div className="px-3 py-2 text-[11px] text-gray-500 bg-white border-t md:hidden"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
